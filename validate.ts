/* eslint-disable @typescript-eslint/no-unused-vars */

import { Decorator } from '@gerrit0/typedoc'
import Ajv from 'ajv'
import { JSONSchema7Definition, JSONSchema7 } from 'json-schema'
import json5 from 'json5'
import { log } from './log'
import { Option, Validator } from './types'

const ajv = new Ajv()

/**
 * @module validators
 *
 * Module that defines validation decorators for configuration options.
 *
 * The following list of validators and their documentation is
 * copied directly from the JSON Schema v2019-09 specification at
 * https://datatracker.ietf.org/doc/draft-handrews-json-schema-validation.
 *
 * The only validators from there that are excluded are:
 * - `type`, since that is implicit in the Typescript definition of a option
 * - `const`, since having a constant option is sorta pointless
 */

// These validation decorators are purely declarative and used in static analysis
// of configuration options. They all return the `propertyDecorator` function
// which does nothing.
const propertyDecorator: PropertyDecorator = (
  target: Record<string, any>,
  propertyKey: string | symbol
) => {}

// Validation keywords for any instance type

/**
 * @param value An array.  This array SHOULD have
 * at least one element.  Elements in the array SHOULD be unique.
 *
 * An instance validates successfully against this keyword if its value
 * is equal to one of the elements in this keyword's array value.
 *
 * Elements in the array might be of any type, including null.
 */
export const enumeration = (value: unknown[]): PropertyDecorator =>
  propertyDecorator

// Validation keywords for numeric instances (number and integer)

/**
 * @param value A number, strictly greater than 0.
 *
 * A numeric instance is valid only if division by this keyword's value
 * results in an integer.
 */
export const multipleOf = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * @param value A number, representing an inclusive
 * upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the
 * instance is less than or exactly equal to "maximum".
 */

export const maximum = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A number, representing an
 * exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it
 * has a value strictly less than (not equal to) "exclusiveMaximum".
 */
export const exclusiveMaximum = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * @param value A number, representing an inclusive
 * lower limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the
 * instance is greater than or exactly equal to "minimum".
 */
export const minimum = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A number, representing an
 * exclusive lower limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it
 * has a value strictly greater than (not equal to) "exclusiveMinimum".
 */
export const exclusiveMinimum = (value: number): PropertyDecorator =>
  propertyDecorator

// Validation keywords for strings

/**
 * @param value A non-negative integer.
 *
 * A string instance is valid against this keyword if its length is less
 * than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its
 * characters as defined by RFC 8259 [RFC8259].
 */
export const maxLength = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A non-negative integer.
 *
 * A string instance is valid against this keyword if its length is
 * greater than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its
 * characters as defined by RFC 8259 [RFC8259].
 *
 * Omitting this keyword has the same behavior as a value of 0.
 */
export const minLength = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A string.  This string SHOULD be a
 * valid regular expression, according to the ECMA 262 regular
 * expression dialect.

 * A string instance is considered valid if the regular expression
 * matches the instance successfully.  Recall: regular expressions are
 * not implicitly anchored.
 */
export const pattern = (regexp: RegExp): PropertyDecorator => propertyDecorator

// Validation keywords for arrays

/**
 * @param value A non-negative integer.
 *
 * An array instance is valid against "maxItems" if its size is less
 * than, or equal to, the value of this keyword.
 */
export const maxItems = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A non-negative integer.
 *
 * An array instance is valid against "minItems" if its size is greater
 * than, or equal to, the value of this keyword.
 *
 * Omitting this keyword has the same behavior as a value of 0.
 */
export const minItems = (value: number): PropertyDecorator => propertyDecorator

/**
 * @param value A boolean.
 *
 * If this keyword has boolean value false, the instance validates
 * successfully.  If it has boolean value true, the instance validates
 * successfully if all of its elements are unique.
 *
 * Omitting this keyword has the same behavior as a value of false.
 */
export const uniqueItems = (value = true): PropertyDecorator =>
  propertyDecorator

/**
 * @param value A valid JSON Schema.
 *
 * An array instance is valid against "contains" if at least one of its
 * elements is valid against the given schema. Note that when collecting
 * annotations, the subschema MUST be applied to every array element even
 * after the first match has been found. This is to ensure that all
 * possible annotations are collected.
 *
 * Used in conjunction with {@link minContains} and/or {@link maxContains}.
 */
export const contains = (value: object): PropertyDecorator => propertyDecorator

/**
 * @param value A non-negative integer.
 *
 * An array instance is valid against "maxContains" if the number of
 * elements that are valid against the schema for "contains"
 * [json-schema] is less than, or equal to, the value of this keyword.
 *
 * If "contains" is not present within the same schema object, then this
 * keyword has no effect.
 */
export const maxContains = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * @param value A non-negative integer.
 *
 * An array instance is valid against "minContains" if the number of
 * elements that are valid against the schema for "contains"
 * [json-schema] is greater than, or equal to, the value of this
 * keyword.
 *
 * A value of 0 is allowed, but is only useful for setting a range of
 * occurrences from 0 to the value of "maxContains".  A value of 0 with
 * no "maxContains" causes "contains" to always pass validation.
 *
 * If "contains" is not present within the same schema object, then this
 * keyword has no effect.
 *
 * Omitting this keyword has the same behavior as a value of 1.
 */
export const minContains = (value: number): PropertyDecorator =>
  propertyDecorator

// Validation keywords for objects

/**
 * @param value A non-negative integer.
 *
 * An object instance is valid against "maxProperties" if its number of
 * properties is less than, or equal to, the value of this keyword.
 */
export const maxProperties = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * @param value A non-negative integer.
 *
 * An object instance is valid against "minProperties" if its number of
 * properties is greater than, or equal to, the value of this keyword.
 *
 * Omitting this keyword has the same behavior as a value of 0.
 */
export const minProperties = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * @param value An array.  Elements of this array,
 * if any, MUST be strings, and MUST be unique.
 *
 * An object instance is valid against this keyword if every item in the
 * array is the name of a property in the instance.
 *
 * Omitting this keyword has the same behavior as an empty array.
 */
export const required = (value: string[]): PropertyDecorator =>
  propertyDecorator

/**
 * @param value An object.  Properties in this
 * object, if any, MUST be arrays.  Elements in each array, if any, MUST
 * be strings, and MUST be unique.
 *
 * This keyword specifies properties that are required if a specific
 * other property is present.  Their requirement is dependent on the
 * presence of the other property.
 *
 * Validation succeeds if, for each name that appears in both the
 * instance and as a name within this keyword's value, every item in the
 * corresponding array is also the name of a property in the instance.
 *
 * Omitting this keyword has the same behavior as an empty object.
 */
export const dependentRequired = (value: {
  [key: string]: string[]
}): PropertyDecorator => propertyDecorator

/**
 * Parse a validation decorator.
 *
 * Checks that the validation keyword is valid for the
 * type of the option
 *
 * @param decorator The TypeDoc decorator to parse
 * @param id An identifier for the option to used for logs
 */
export const decoratorToValidator = (
  option: Option,
  decorator: Decorator
): Validator => {
  const { parent, name, type } = option
  const { name: keyword, arguments: args } = decorator
  const id = `${parent}.${name}`

  const logWrongType = (): void =>
    log.error(
      `Option validator "${keyword}" does not apply to option of type "${type}": ${id}`
    )

  let arg = Object.values(args)[0] as string
  switch (keyword) {
    /* eslint-disable no-fallthrough */

    // Keywords for any instance type
    case 'enumeration':
      break

    // Keywords for numeric instances
    case 'multipleOf':
    case 'maximum':
    case 'exclusiveMaximum':
    case 'minimum':
    case 'exclusiveMinimum':
      if (type !== 'number') logWrongType()
      break

    // Keywords for strings
    case 'pattern':
      // Wrap the RegExp in quotes for parsing
      arg = `"${arg}"`
    case 'maxLength':
    case 'minLength':
      if (type !== 'string') logWrongType()
      break

    // Keywords for arrays
    case 'uniqueItems':
      // Default arg is true
      arg = arg === undefined ? 'true' : arg
    case 'maxItems':
    case 'minItems':
    case 'contains':
    case 'maxContains':
    case 'minContains':
      if (!(type === 'array' || type.includes('Array<') || type.includes('[]')))
        logWrongType()
      break

    // Keywords for objects
    case 'maxProperties':
    case 'minProperties':
    case 'required':
    case 'dependentRequired':
      if (type !== 'object') logWrongType()
      break

    /* eslint-enable no-fallthrough */

    // Unknown keyword
    default:
      log.error(`Option has unknown validator "${keyword}": ${id}`)
  }

  let value
  if (arg === undefined) {
    log.error(`Option validator "${keyword}" has no argument: ${id}`)
  } else {
    // Parse the validation value. No type checking is
    // done since that should be done by Typescript on the definition
    try {
      value = json5.parse(arg)
    } catch (error) {
      log.error(
        `Option validator has argument that can not be parsed: ${id}: ${error.message}`
      )
    }
  }

  return {
    keyword,
    value
  }
}

export const validatorToJsonSchema = (validator: Validator): JSONSchema7 => {
  let { keyword, value } = validator
  if (keyword === 'enumeration') keyword = 'enum'
  return { [keyword]: value }
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
