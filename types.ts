/**
 * A validator.
 */
export interface Validator {
  keyword: string
  value: unknown
}

/**
 * A configuration option.
 */
export interface Option {
  parent: string
  name: string
  description: string
  details?: string
  type: string
  defaultValue?: boolean | number | string | [] | {}
  validators?: Validator[]
}
