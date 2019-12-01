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
import { types } from '@babel/core'

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
 * Filter those validators that apply to a particular type
 *
 * @param validators The validators to filter
 * @param type  The type to filter for
 */
export const validatorsForType = (
  validators: Validator[],
  type: string
): object => {
  const keywordsMap: { [key: string]: string[] } = {
    number: [
      'multipleOf',
      'maximum',
      'exclusiveMaximum',
      'minimum',
      'exclusiveMinimum'
    ],
    string: ['pattern', 'maxLength', 'minLength'],
    array: [
      'uniqueItems',
      'maxItems',
      'minItems',
      'contains',
      'maxContains',
      'minContains'
    ],
    object: ['maxProperties', 'minProperties', 'required', 'dependentRequired']
  }
  const keywords = keywordsMap[type]
  if (keywords === undefined) return keywords
  return validators
    .filter(({ keyword }) => keywords.includes(keyword) || keyword === 'enumeration')
    .reduce((prev, validator) => {
      return { ...prev, ...validatorToJsonSchema(validator) }
    }, {})
}

/**
 * Convert a Typescript type and associated validators to a JSON Schema
 *
 * @param type The Typescript type name
 */
export const typeToJsonSchema = (
  type: string,
  validators: Validator[]
): JSONSchema7 => {
  switch (type) {
    case 'any':
      return { ...validatorsForType(validators, type) }
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'object':
      return { type, ...validatorsForType(validators, type) }
  }

  const arrayMatch = /^([a-z]+)\[\]/.exec(type)
  if (arrayMatch !== null) {
    const itemSchema = typeToJsonSchema(arrayMatch[1], validators)
    return {
      type: 'array',
      items: itemSchema,
      ...validatorsForType(validators, 'array')
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
      const { name, description, types, validators = [] } = option
      const subschemas = types.map(type => typeToJsonSchema(type, validators))
      const property = {
        description,
        ...(subschemas.length === 1 ? subschemas[0] : { anyOf: subschemas })
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
    let { errors = [] } = validate
    if (errors === null) errors = []
    log.error(
      `Option has default value that is not valid against its validators: ${id}: ${errors.map(error => error.message).join(', ')}`
    )
  }
}
