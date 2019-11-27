/**
 * @module develop-schema
 *
 * Module for generation of JSON Schema during development of a
 * package using Configa.
 */

import Ajv from 'ajv'
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import json5 from 'json5'
import { log, Option, Validator } from './common'

const ajv = new Ajv()

/**
 * Convert a validator to a JSON Schema object.
 *
 * @param validator The `Validator` to convert
 */
export const validatorToJsonSchema = (validator: Validator): JSONSchema7 => {
  const { keyword, value } = validator
  const prop = keyword === 'enumeration' ? 'enum' : keyword
  return { [prop]: value }
}

/**
 * Convert a Typescript type to a JSON Schema
 *
 * @param type The Typescript type name
 */
export const typescriptTypeToJsonSchema = (type: string): JSONSchema7 => {
  switch (type) {
    case 'any':
      return {}
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'object':
      return { type }
  }

  if (type.includes('|')) {
    return {
      enum: type.split(/\s*\|\s*/).map(item => {
        try {
          return json5.parse(item)
        } catch (error) {
          log.error(`Unable to parse item in enumeration: ${item}`)
          return ''
        }
      })
    }
  }

  const arrayMatch = /^([a-z]+)\[\]/.exec(type)
  if (arrayMatch !== null) {
    const itemSchema = typescriptTypeToJsonSchema(arrayMatch[1])
    return {
      type: 'array',
      items: itemSchema
    }
  }

  // Not able to convert Typescript type to a JSON Schema
  // so return an empty schema (i.e. no validation)
  log.warn(`Unable to convert Typescript type "${type}" to JSON Schema`)
  return {}
}

/**
 * Generate a JSON Schema definition for a set of options.
 *
 * @param option The option to generate the schema for
 */
export const generateJsonSchemaDefinition = (
  options: Option[]
): JSONSchema7Definition => {
  // @ts-ignore
  const properties = options.reduce(
    (properties: { [key: string]: JSONSchema7 }, option: Option) => {
      const { name, description, type, validators = [] } = option
      const property = {
        description,
        ...typescriptTypeToJsonSchema(type),
        ...validators.reduce(
          (prev, validator) => ({
            ...prev,
            ...validatorToJsonSchema(validator)
          }),
          {}
        )
      }
      return property !== undefined
        ? { ...properties, ...{ [name]: property } }
        : properties
    },
    {}
  )
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties
  } as JSONSchema7
}

/**
 * Generate a JSON Schema document for a set of options.
 *
 * @param option The option to generate the schema for
 */
export const generateJsonSchema = (options: Option[]): string =>
  JSON.stringify(generateJsonSchemaDefinition(options), null, '  ')

/**
 * Check that the default value for an option is valid
 * against any validators it may have.
 *
 * @param option The option to validate
 */
export const validateDefault = (option: Option): void => {
  const { parent, name, defaultValue } = option
  if (defaultValue === undefined) return
  const id = `${parent}.${name}`
  const schema = generateJsonSchemaDefinition([option])
  let validate
  try {
    validate = ajv.compile(schema)
  } catch (error) {
    log.warn(`Error compiling JSON Schema for option: ${id}: ${error.message}`)
  }
  if (validate !== undefined && validate({ [name]: defaultValue }) !== true) {
    log.error(
      `Option has default value that is not valid against its validators: ${id}`
    )
  }
}
