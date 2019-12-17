/**
 * @module run-collect
 *
 * Module for collecting configuration options at run time in a
 * package using Configa (e.g. validating config options read from a file)
 */

import rc from 'rc'
import Ajv from 'ajv'
import { getLogger, Logger } from '@stencila/logga'
import { JSONSchema7 } from 'json-schema'

const ajv = new Ajv({
  // Coerce type of data to match type keyword and coerce scalar
  // data to an array with one element and vice versa, as needed.
  coerceTypes: true,
  // Use default values where properties are missing.
  useDefaults: true,
  // Generate all error messages
  allErrors: true
})

/**
 * Collect configuration options.
 *
 * @param appName The name of the application to collect configuration options for.
 */
export function collectConfig<ConfigType extends object>(
  appName: string,
  schema: object
): {
  args?: string[]
  options: {[key: string]: any}
  config: ConfigType
  valid: boolean
  log: Logger
} {
  const log = getLogger(appName)

  // Use rc to collect options from config files and argv
  let { _, ...options } = rc(appName)

  // Transform the `---help` and `--version` "options" into
  // arguments (to be treated as commands)
  if ('version' in options) _ = ['version', ..._]
  if ('help' in options) _ = ['help', ..._]

  const args = _.length > 0 ? _ : undefined

  const coerced = coerceOptions(options, schema)
  const [validated, valid] = validateOptions(coerced, schema, log)

  const config = validated as ConfigType
  return { args, options, config, valid, log }
}

/**
 * Coerce options to a JSON Schema.
 *
 * This function only does coercions that Ajv does not.
 *
 * @param value The value to coerce
 * @param schema The schema to coerce to
 * @param log A logger to emit messages to
 */
export function coerceOptions(value: any, schema?: JSONSchema7): object {
  if (schema === undefined) return value
  const { type, properties } = schema

  if (typeof value === 'string' && type === 'array')
    return value.split(/\s*,\s*/)

  if (value === null || typeof value !== 'object' || Array.isArray(value))
    return value

  if (properties === undefined) return value

  return Object.entries(value).reduce((prev, [key, child]) => {
    const value = coerceOptions(child, properties[key] as JSONSchema7)
    return { ...prev, ...{ [key]: value } }
  }, {})
}

/**
 * Validate (and coerce where necessary) options against a JSON Schema
 *
 * @param options The options to validate
 * @param schema The schema to validate against
 * @param log A logger to emit messages to
 */
export function validateOptions(
  options: object,
  schema: JSONSchema7,
  log: Logger
): [object, boolean] {
  const validate = ajv.compile(schema)
  const valid = validate(options) as boolean
  if (!valid) {
    const { errors } = validate
    if (errors === null || errors === undefined) {
      log.error('Error validating configuration options')
    } else {
      for (const error of errors) {
        const { dataPath, message } = error
        const optionPath = dataPath.startsWith('.')
          ? dataPath.slice(1)
          : dataPath
        log.error(`Invalid value for option "${optionPath}": ${message}`)
      }
    }
  }
  return [options, valid]
}
