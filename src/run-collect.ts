/**
 * @module run-collect
 *
 * Module for collecting configuration options at run time in a
 * package using Configa (e.g. validating config options read from a file)
 */

import rc from 'rc'
import Ajv from 'ajv'
import { getLogger, Logger } from '@stencila/logga'

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
export function collectOptions<ConfigType extends object>(
  appName: string,
  schema: object
): { args?: string[]; config: ConfigType; valid: boolean; log: Logger } {
  const log = getLogger(appName)

  // Use rc to collect options from config files and argv
  let { _, ...options } = rc(appName)

  // Transform the `---help` and `--version` "options" into
  // arguments (to be treated as commands)
  if ('version' in options) _ = ['version', ..._]
  if ('help' in options) _ = ['help', ..._]

  const args = _.length > 0 ? _ : undefined

  // Validate and coerce options against schema
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

  const config = options as ConfigType
  return { args, config, valid, log }
}
