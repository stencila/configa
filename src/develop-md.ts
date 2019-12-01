/**
 * @module develop-md
 *
 * Module for generation of Markdown during development of a
 * package using Configa.
 */

import fs from 'fs'
import globby from 'globby'
import { log, Option } from './common'
import { Config } from './config'
import { parseConfig } from './develop-parse'

/**
 * Generate a Markdown usage guide
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

  if (configPath == undefined) {
    const configs = globby.sync('**/(C|c)onfig.ts')[0]
    if (configs.length == 0) {
      log.error(`No config file supplied and none could be found`)
      return
    } else {
      configPath = configs[0]
    }
  } else if (!fs.existsSync(configPath)) {
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
