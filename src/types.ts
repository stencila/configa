/**
 * @module types
 *
 * Module for type definitions used in
 * in several other modules.
 */

/**
 * A JSON Schema validator.
 *
 * @see {@link https://datatracker.ietf.org/doc/draft-handrews-json-schema-validation| JSON Schema}
 */
export interface Validator {
  /**
   * The validation keyword
   */
  keyword:
    | 'enumeration'
    | 'multipleOf'
    | 'maximum'
    | 'exclusiveMaximum'
    | 'minimum'
    | 'exclusiveMinimum'
    | 'pattern'
    | 'maxLength'
    | 'minLength'
    | 'uniqueItems'
    | 'maxItems'
    | 'minItems'
    | 'contains'
    | 'maxContains'
    | 'minContains'
    | 'maxProperties'
    | 'minProperties'
    | 'required'
    | 'dependentRequired'

  /**
   * The validation value (i.e. argument)
   */
  value: unknown
}

/**
 * A configuration option.
 */
export interface Option {
  /**
   * The name of the option's parent class.
   */
  parent: string

  /**
   * The name of the option.
   */
  name: string

  /**
   * A description of the option.
   */
  description: string

  /**
   * Details about the options. Used for
   * additional details beyond what is appropriate
   * for the description.
   */
  details?: string

  /**
   * The Typescript type signature of the option.
   */
  type: string

  /**
   * The default value for the option.
   */
  defaultValue?: boolean | number | string | [] | {}

  /**
   * A list of validators to be applied to the option.
   */
  validators?: Validator[]
}
