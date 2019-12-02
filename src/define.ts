/**
 * @module define
 *
 * Module with functions needed for defining configurations. This module
 * will usually be imported directly into `config.ts` files e.g.
 *
 * ```ts
 * import {minimum, maximum} from '@stencila/configa/define'
 * ```
 *
 * The following list of validators and their documentation is
 * copied directly from the JSON Schema v2019-09 specification at
 * https://datatracker.ietf.org/doc/draft-handrews-json-schema-validation.
 *
 * The only validators from there that are excluded are:
 * - `type`, since that is implicit in the Typescript definition of a option
 * - `const`, since having a constant option is sorta pointless
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

// These validation decorators are purely declarative and used in static analysis
// of configuration options. They all return the `propertyDecorator` function
// which does nothing.
const propertyDecorator: PropertyDecorator = (
  target: Record<string, any>,
  propertyKey: string | symbol
) => {}

// Validation keywords for any instance type

/**
 * An instance validates successfully against this keyword if its value
 * is equal to one of the elements in this keyword's array value.
 *
 * Elements in the array might be of any type, including null.
 *
 * @param value An array.  This array SHOULD have
 * at least one element.  Elements in the array SHOULD be unique.
 */
export const enumeration = (value: unknown[]): PropertyDecorator =>
  propertyDecorator

// Validation keywords for numeric instances (number and integer)

/**
 * A numeric instance is valid only if division by this keyword's value
 * results in an integer.
 *
 * @param value A number, strictly greater than 0.
 */
export const multipleOf = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * If the instance is a number, then this keyword validates only if the
 * instance is less than or exactly equal to "maximum".
 *
 * @param value A number, representing an inclusive
 * upper limit for a numeric instance.
 */

export const maximum = (value: number): PropertyDecorator => propertyDecorator

/**
 * If the instance is a number, then the instance is valid only if it
 * has a value strictly less than (not equal to) "exclusiveMaximum".
 *
 * @param value A number, representing an
 * exclusive upper limit for a numeric instance.
 */
export const exclusiveMaximum = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * If the instance is a number, then this keyword validates only if the
 * instance is greater than or exactly equal to "minimum".
 *
 * @param value A number, representing an inclusive
 * lower limit for a numeric instance.
 */
export const minimum = (value: number): PropertyDecorator => propertyDecorator

/**
 * If the instance is a number, then the instance is valid only if it
 * has a value strictly greater than (not equal to) "exclusiveMinimum".
 *
 * @param value A number, representing an
 * exclusive lower limit for a numeric instance.
 */
export const exclusiveMinimum = (value: number): PropertyDecorator =>
  propertyDecorator

// Validation keywords for strings

/**
 * A string instance is valid against this keyword if its length is less
 * than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its
 * characters as defined by RFC 8259 [RFC8259].
 *
 * @param value A non-negative integer.
 */
export const maxLength = (value: number): PropertyDecorator => propertyDecorator

/**
 * A string instance is valid against this keyword if its length is
 * greater than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its
 * characters as defined by RFC 8259 [RFC8259].
 *
 * Omitting this keyword has the same behavior as a value of 0.
 *
 * @param value A non-negative integer.
 */
export const minLength = (value: number): PropertyDecorator => propertyDecorator

/**
 * A string instance is considered valid if the regular expression
 * matches the instance successfully.  Recall: regular expressions are
 * not implicitly anchored.
 *
 * @param value A string.  This string SHOULD be a
 * valid regular expression, according to the ECMA 262 regular
 * expression dialect.
 */
export const pattern = (regexp: RegExp): PropertyDecorator => propertyDecorator

// Validation keywords for arrays

/**
 * An array instance is valid against "maxItems" if its size is less
 * than, or equal to, the value of this keyword.
 *
 * @param value A non-negative integer.
 */
export const maxItems = (value: number): PropertyDecorator => propertyDecorator

/**
 * An array instance is valid against "minItems" if its size is greater
 * than, or equal to, the value of this keyword.
 *
 * Omitting this keyword has the same behavior as a value of 0.
 *
 * @param value A non-negative integer.
 */
export const minItems = (value: number): PropertyDecorator => propertyDecorator

/**
 * If this keyword has boolean value false, the instance validates
 * successfully.  If it has boolean value true, the instance validates
 * successfully if all of its elements are unique.
 *
 * Omitting this keyword has the same behavior as a value of false.
 *
 * @param value A boolean.
 */
export const uniqueItems = (value = true): PropertyDecorator =>
  propertyDecorator

/**
 * An array instance is valid against "contains" if at least one of its
 * elements is valid against the given schema. Note that when collecting
 * annotations, the subschema MUST be applied to every array element even
 * after the first match has been found. This is to ensure that all
 * possible annotations are collected.
 *
 * Used in conjunction with {@link minContains} and/or {@link maxContains}.
 *
 * @param value A valid JSON Schema.
 */
export const contains = (value: object): PropertyDecorator => propertyDecorator

/**
 * An array instance is valid against "maxContains" if the number of
 * elements that are valid against the schema for "contains"
 * [json-schema] is less than, or equal to, the value of this keyword.
 *
 * If "contains" is not present within the same schema object, then this
 * keyword has no effect.
 *
 * @param value A non-negative integer.
 */
export const maxContains = (value: number): PropertyDecorator =>
  propertyDecorator

/**
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
 *
 * @param value A non-negative integer.
 */
export const minContains = (value: number): PropertyDecorator =>
  propertyDecorator

// Validation keywords for objects

/**
 * An object instance is valid against "maxProperties" if its number of
 * properties is less than, or equal to, the value of this keyword.
 *
 * @param value A non-negative integer.
 */
export const maxProperties = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * An object instance is valid against "minProperties" if its number of
 * properties is greater than, or equal to, the value of this keyword.
 *
 * Omitting this keyword has the same behavior as a value of 0.
 *
 * @param value A non-negative integer.
 */
export const minProperties = (value: number): PropertyDecorator =>
  propertyDecorator

/**
 * An object instance is valid against this keyword if every item in the
 * array is the name of a property in the instance.
 *
 * Omitting this keyword has the same behavior as an empty array.
 *
 * @param value An array.  Elements of this array,
 * if any, MUST be strings, and MUST be unique.
 */
export const required = (value: string[]): PropertyDecorator =>
  propertyDecorator

/**
 * This keyword specifies properties that are required if a specific
 * other property is present.  Their requirement is dependent on the
 * presence of the other property.
 *
 * Validation succeeds if, for each name that appears in both the
 * instance and as a name within this keyword's value, every item in the
 * corresponding array is also the name of a property in the instance.
 *
 * Omitting this keyword has the same behavior as an empty object.
 *
 * @param value An object.  Properties in this
 * object, if any, MUST be arrays.  Elements in each array, if any, MUST
 * be strings, and MUST be unique.
 */
export const dependentRequired = (value: {
  [key: string]: string[]
}): PropertyDecorator => propertyDecorator
