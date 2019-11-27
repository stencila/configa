/**
 * @module run-collect
 *
 * Module for collecting configuration options at run time in a
 * package using Configa (e.g. validating config options read from a file)
 */

import rc from 'rc'

/**
 * Collect configuration options.
 *
 * @param appName The name of the application to collect configuration options for.
 */
export function collectOptions<ConfigType extends object>(
  appName: string,
  defaults: ConfigType
): { args?: string[]; config: ConfigType } {
  const { _, ...options } = rc(appName)
  const args = _.length > 0 ? _ : undefined
  const config = { ...defaults, ...(options as ConfigType) }
  return { args, config }
}
