/**
 * @module develop-samples
 *
 * Module for generation of sample configuration files
 * during development of a package using Configa.
 */

import { Option } from './common'

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
    const { description, name, types, defaultValue = null } = option
    const desc = description.replace('\n', '\n  // ')
    const value = JSON.stringify(defaultValue, null, '  ').replace(
      /\n/gm,
      '\n  '
    )
    return `  // ${desc}\n  // type: ${types.join(
      ' | '
    )}\n  "${name}": ${value}`
  })
  .join(',\n\n')}
}`
}
