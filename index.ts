/**
 * Script to generate docs for configuration options
 */

import * as typedoc from '@gerrit0/typedoc'
import fs from 'fs'
import json5 from 'json5'
import rc from 'rc'
import { Config } from './config'
import { log } from './log'
import { Option } from './types'
import { decoratorToValidator, validateDefault } from './validate'

/**
 * Parse a Typescript configuration file.
 *
 * @param filePath The path the to file
 * @returns An array of configuration options
 */
export function parseConfig(filePath: string): Option[] {
  const app = new typedoc.Application({
    module: 'commonjs',
    target: 'es2017',
    esModuleInterop: true,
    experimentalDecorators: true
  })

  const files = app.convert([filePath])
  if (files === undefined || files.children === undefined) return []

  // Get the declaration object for the file
  const file = files.children.filter(decl => decl.originalName === filePath)[0]
  if (file.children === undefined) return []

  // Get the first class defined in the file
  const clas = Object.values(file.children).filter(
    decl => decl.kindString === 'Class'
  )[0]
  if (clas.children === undefined) return []

  // Sort properties by declaration order within the class
  const props = clas.children.sort((a, b) =>
    a.sources !== undefined && b.sources !== undefined
      ? a.sources[0].line > b.sources[0].line
        ? 1
        : -1
      : 0
  )

  // Convert properties into `Options` for easier processing
  // and generate error messages where needed
  const parent = clas.name
  return props.map((prop: typedoc.DeclarationReflection) => {
    const {
      name,
      comment,
      type: typeObj,
      defaultValue: defaultString,
      decorators = []
    } = prop
    const id = `${parent}.${name}`

    let description
    let details
    if (comment === undefined) {
      description = ''
      log.error(`Option is missing description: ${id}`)
    } else {
      description = comment.shortText.trim()
      if (description.length > 100)
        log.warn(`Option has long description: ${id}`)
      details = comment.text.trim().length > 0 ? comment.text.trim() : undefined
    }

    let type
    if (typeObj === undefined || typeObj.toString() === 'any') {
      type = 'any'
      log.error(`Option has type 'any': ${id}`)
    } else {
      type = typeObj.toString()
      // Normalize type name for arrays to suffix `[]` form
      type = type.replace(/Array<([^>]+)>/, '$1[]')
    }

    let defaultValue
    if (defaultString === undefined) {
      if (type === 'object') {
        defaultValue = {}
        log.warn(
          `Default values for options of type object can not be handled: ${id}`
        )
      }
    } else {
      try {
        defaultValue = json5.parse(defaultString)
      } catch (error) {
        defaultValue = ''
        log.error(
          `Option default value can not be parsed: ${id}: ${error.message}`
        )
      }
    }

    const option: Option = {
      parent,
      name,
      description,
      details,
      type,
      defaultValue
    }

    option.validators = decorators.map(decorator =>
      decoratorToValidator(option, decorator)
    )

    validateDefault(option)

    return option
  })
}

/**
 * Generate configuration help for command line applications
 *
 * @param options The options to generate the help for
 */
export function generateCliHelp(options: Option[]): string {
  return `${options
    .map(option => {
      const { name, description, type, defaultValue } = option
      return `--${name} ${description} ${type} ${defaultValue}`
    })
    .join('\n')}`
}

/**
 * Generate a
 */
export function generateMdUsage(
  appName: string,
  optionName = '<option>',
  optionValue = '<value>'
): string {
  return `
All configuration options can be set, in descending order of priority, by:

- a command line argument e.g. \`--${optionValue} ${optionValue}\`
- an environment variable prefixed with \`${appName.toUpperCase()}_\` e.g. \`${appName.toUpperCase()}_${optionName}=${optionValue}\`
- a \`.json\` or \`.ini\` configuration file, set using the \`--config\` option, or \`.${appName}rc\` by default
`
}

/**
 * Generate a Markdown table for a set of options
 *
 * @param options The options to generate the table for
 * @param addDetails Should option details be added after the table?
 */
export function generateMdTable(options: Option[], addDetails = true): string {
  const header = ['Name', 'Description', 'Type', 'Default']

  // Generate the rows of data with escaping to prevent
  // multi-lines and pipes
  let detailsCount = 0
  const rows = options.map(option => {
    const { name, description, details, type, defaultValue } = option
    return [
      name,
      description +
        (addDetails && details !== undefined
          ? `<a href="#${name}-details"><sup>${++detailsCount}</sup></a>`
          : ''),
      type,
      `\`${JSON.stringify(defaultValue)}\``
    ].map((value): string => value.replace(/\s+/gm, ' ').replace(/\|/, '\\|'))
  })

  // Get maximum width of content in each column
  const widths = [header].concat(rows).reduce((prev, row) => {
    return row.map((cell, column) => Math.max(prev[column], cell.length))
  }, new Array(header.length).fill(0))

  // Generate dashes row
  const dashes = widths.map(width => '-'.repeat(width))

  // Generate table
  const table = [header, dashes].concat(rows).reduce((md, row) => {
    return (
      md +
      '| ' +
      row.map((content, column) => content.padEnd(widths[column])).join(' | ') +
      ' |\n'
    )
  }, '')

  return (
    '\n' + table + (addDetails ? '\n' + generateMdDetails(options) : '') + '\n'
  )
}

/**
 * Generate a Markdown ordered list of details across
 * a set of options.
 *
 * Includes anchors so that each detail can be linked to
 * from elsewhere. If an option has no details then it
 * will not be in the list.
 *
 * @param options The options to generate the list for
 */
export function generateMdDetails(options: Option[]): string {
  let index = 0
  return (
    '\n' +
    options
      .map(option => {
        const { details, name } = option
        return details !== undefined
          ? `${++index}. <a id="${name}-details"></a>${details}`
          : ''
      })
      .filter(md => md.length > 0)
      .join('\n') +
    '\n'
  )
}

/**
 * Insert Markdown into a Markdown string.
 *
 * @param doc The Markdown string to insert in to
 * @param content The Markdown content to insert as a map of tags to content e.g. `{TABLE: '...'}`
 */
export function insertMd(
  doc: string,
  content: { [key: string]: string }
): string {
  for (const [tag, md] of Object.entries(content)) {
    doc = doc.replace(
      new RegExp(
        `<!-- CONFIGA-${tag}-BEGIN -->[\\s\\S]*?<!-- CONFIGA-${tag}-END -->`,
        'gm'
      ),
      `<!-- CONFIGA-${tag}-BEGIN -->${md}<!-- CONFIGA-${tag}-END -->`
    )
  }
  return doc
}

/**
 * Insert Markdown into a Markdown file.
 *
 * @param str
 * @param width
 */
export function insertMdIntoFile(
  filePath: string,
  content: { [key: string]: string }
): void {
  const doc = fs.readFileSync(filePath, 'utf8')
  fs.writeFileSync(filePath, insertMd(doc, content))
}

/**
 * Insert Markdown into a `README.md` file.
 *
 * Inserts the all possible generated Markdown sections,
 * but only if corresponding tags exist.
 */
export function updateReadme(config: Config): void {
  let { appName, configPath, readmePath } = config
  if (appName === undefined) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const match = pkg.name.match(/(@\w+\/)?(\w+)$/)
    if (match === null) {
      log.error(`Could not parse app name from package name: ${pkg.name}`)
      return
    }
    appName = match[2] as string
  }
  if (!fs.existsSync(configPath)) {
    log.error(`Config file does not exist: ${configPath}`)
    return
  }
  if (!fs.existsSync(readmePath)) {
    log.error(`README file does not exist: ${readmePath}`)
    return
  }
  const options = parseConfig(configPath)
  insertMdIntoFile(readmePath, {
    USAGE: generateMdUsage(appName),
    TABLE: generateMdTable(options)
  })
}

/**
 * Collect configuration options.
 *
 * @param appName The name of the application to collect configuration options for.
 */
export function collect<ConfigType extends object>(
  appName: string,
  defaults: ConfigType
): { args?: string[]; config: ConfigType } {
  const { _, ...options } = rc(appName)
  const args = _.length > 0 ? _ : undefined
  const config = { ...(options as ConfigType), ...defaults }
  return { args, config }
}

/**
 * Wrap a string to a maximum width (i.e. "wordwrap").
 *
 * Based on https://stackoverflow.com/a/51506718/4625911
 *
 * @param str The string to wrap
 * @param width The maximum width
 */
export const wrap = (str: string, width = 80): string =>
  str.replace(
    new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g'),
    '$1\n'
  )
