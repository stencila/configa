/**
 * @module samples
 *
 * A module that defines functions for generating sample configuration
 * files in alternatives formats.
 */

import { Option } from './types'

/**
 * Generate a sample configuration in JSON with description comments
 * and default values.
 *
 * @param options The configuration options to generate the sample for
 */
export function generateJsonSample(options: Option[]): string {
  return `{
${options
  .map(option => {
    const { description, name, type, defaultValue } = option
    const desc = description.replace('\n', '\n  // ')
    const value = JSON.stringify(defaultValue, null, '  ').replace(
      /\n/gm,
      '\n  '
    )
    return `  // ${desc}\n  // type: ${type}\n  "${name}": ${value}`
  })
  .join(',\n\n')}
}`
}
