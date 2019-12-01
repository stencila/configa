/**
 * @module run-cli
 *
 * Module for generating CLI messages at run time in a
 * package using Configa
 */

import { Option } from './common'

/**
 * Generate configuration help for command line applications
 *
 * @param options The options to generate the help for
 */
export function generateCliHelp(options: Option[]): string {
  return `${options
    .map(option => {
      const { name, description, types, defaultValue } = option
      return `--${name} ${description} ${types} ${defaultValue}`
    })
    .join('\n')}`
}
