/**
 * @module run-help
 *
 * Module for generating CLI help messages at run time in a
 * package using Configa
 */

import { JSONSchema7 } from 'json-schema'
import json5 from 'json5'
import chalk from 'chalk'

export function helpUsage(schema: object, option?: string): string {
  if (option === undefined) {
    const { description = '' } = schema as JSONSchema7
    const options = helpListOptions(schema)
    return `${description}\n\n${chalk.bold('Options')}\n${options}`
  } else {
    return helpForOption(schema, option)
  }
}

export function helpListOptions(schema: object): string {
  const { properties = {} } = schema as JSONSchema7
  return `${Object.entries(properties)
    .map(([name, schema]) => {
      if (typeof schema === 'boolean') return ''
      const { description, type, anyOf, default: defaultValue } = schema
      let line = `${chalk.magenta(name.padEnd(20))} ${description}`

      let typeName
      if (type === undefined && anyOf !== undefined) {
        typeName = anyOf
          .map(item => (typeof item !== 'boolean' ? item.type : ''))
          .filter(type => typeof type === 'string')
          .join(' | ')
      } else {
        typeName = type
      }
      line += chalk.italic.cyan(` ${typeName}`)

      if (defaultValue !== undefined)
        line += chalk.grey(` ${json5.stringify(defaultValue)}`)
      return line
    })
    .join('\n')}`
}

export function helpForOption(schema: object, option: string): string {
  const { properties = {} } = schema as JSONSchema7
  const subschema = properties[option]
  if (subschema === undefined || typeof subschema === 'boolean')
    return `No such option available: ${option}`
  const { description, $comment } = subschema
  return `${option}\n${description}\n${$comment}`
}
