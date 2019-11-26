/**
 * These tests use file snapshots as a convenient way to
 * check expected outputs of different types. During development
 * it can be useful to update these snapshots on the fly using:
 *
 * ```bash
 * npx jest --watch --updateSnapshot
 * ```
 */

import { addHandler, removeHandler, defaultHandler } from '@stencila/logga'
import fs from 'fs'
import { toMatchFile } from 'jest-file-snapshot'
import path from 'path'
import {
  generateCliHelp,
  generateMdTable,
  insertMd,
  parseConfig,
  wrap,
  updateReadme
} from '.'
import { generateJsonSample } from './samples'

/**
 * Import and instantiate Typescript fixture configs,
 * just to test that decorators etc can be
 * compiled and run and are included in coverage.
 */
import { ConfigSimple } from './fixtures/config-simple'
import { ConfigValidators } from './fixtures/config-validators'
import { generateJsonSchema } from './validate'

// Get the path to a fixture file
const fixture = (name: string): string => path.join(__dirname, 'fixtures', name)

// Extend expect with file snapshot matcher
expect.extend({ toMatchFile })

// Get the path to a snapshot file
const snapshot = (name: string): string =>
  path.join(__dirname, 'snapshots', name)

/* eslint-disable @typescript-eslint/no-unused-vars */
const configSimpleDefaults = new ConfigSimple()
const configValidatorsDefaults = new ConfigValidators()
/* eslint-enable @typescript-eslint/no-unused-vars */

// Parse the test configs for use across below tests
const configSimple = parseConfig(fixture('config-simple.ts'))
const configValidators = parseConfig(fixture('config-validators.ts'))

describe('parseConfig', () => {
  // Remove the default log handler to reduce noise
  // so that real errors are more noticable
  removeHandler(defaultHandler)

  // Function to collect a certain number of log events
  const logMessages = (num: number): Promise<string[]> =>
    new Promise(resolve => {
      const logMessages: string[] = []
      const handler = addHandler(
        logData => {
          logMessages.push(logData.message)
          if (logMessages.length >= num) {
            removeHandler(handler)
            resolve(logMessages)
          }
        },
        { tags: ['configa'] }
      )
    })

  test('config-simple-errors.ts', async () => {
    const events = logMessages(7)
    expect(parseConfig(fixture('config-simple-errors.ts')))
    expect(await events).toEqual([
      'Option is missing description: ConfigSimpleErrors.optionA',
      'Option has no default value: ConfigSimpleErrors.optionB',
      "Option has type 'any': ConfigSimpleErrors.optionC",
      "Option has type 'any': ConfigSimpleErrors.optionD",
      'Option has no default value: ConfigSimpleErrors.optionD',
      "Option default value can not be parsed: ConfigSimpleErrors.optionE: JSON5: invalid character 'c' at 1:2",
      'Option has long description: ConfigSimpleErrors.optionF'
    ])
  })

  test('config-validator-errors.ts', async () => {
    const events = logMessages(7)
    expect(parseConfig(fixture('config-validators-errors.ts')))
    expect(await events).toEqual([
      'Option validator "enumeration" has no argument: ConfigValidatorErrors.optionA',
      "Error compiling JSON Schema for option: ConfigValidatorErrors.optionB: schema is invalid: data.properties['optionB'].multipleOf should be number",
      'Option validator "minimum" does not apply to option of type "string": ConfigValidatorErrors.optionC',
      'Option validator "maximum" does not apply to option of type "string": ConfigValidatorErrors.optionC',
      'Option validator "pattern" does not apply to option of type "string[]": ConfigValidatorErrors.optionD',
      'Option validator "maxProperties" does not apply to option of type "string[]": ConfigValidatorErrors.optionD',
      'Option has default value that is not valid against its validators: ConfigValidatorErrors.optionE'
    ])
  })

  // Reinstate default handler
  addHandler(defaultHandler)
})

test('generateJsonSchema', () => {
  expect(generateJsonSchema(configSimple)).toMatchFile(
    snapshot('config-simple.schema.json')
  )
  expect(generateJsonSchema(configValidators)).toMatchFile(
    snapshot('config-validators.schema.json')
  )
})

test('generateJsonSample', () => {
  expect(generateJsonSample(configSimple)).toMatchFile(
    snapshot('config-simple.json')
  )
  expect(generateJsonSample(configValidators)).toMatchFile(
    snapshot('config-validators.json')
  )
})

test('generateCliHelp', () => {
  expect(generateCliHelp(configSimple)).toMatchFile(
    snapshot('config-simple.txt')
  )
})

test('generateMdTable', () => {
  expect(generateMdTable(configSimple)).toMatchFile(
    snapshot('config-simple-table.md')
  )
  expect(generateMdTable(configValidators)).toMatchFile(
    snapshot('config-validators-table.md')
  )
})

test('insertMd', () => {
  expect(
    insertMd(
      `<!-- CONFIGA-HERE-BEGIN -->This will be replaced<!-- CONFIGA-HERE-END -->`,
      {
        HERE: 'Markdown to be inserted',
        DOESNOTEXISTS: 'But not this'
      }
    )
  ).toBe(
    `<!-- CONFIGA-HERE-BEGIN -->Markdown to be inserted<!-- CONFIGA-HERE-END -->`
  )
})

test('updateReadme', () => {
  fs.copyFileSync(fixture('README.md'), fixture('README-actual.md'))
  updateReadme({
    appName: 'test',
    configPath: fixture('config-simple.ts'),
    readmePath: fixture('README-actual.md')
  })
  const md = fs.readFileSync(fixture('README-actual.md'), 'utf8')
  expect(md).toMatchFile(snapshot('README-expected.md'))
})

test('wrap', () => {
  expect(wrap('a')).toBe('a')
  expect(wrap('a'.repeat(90))).toBe('a'.repeat(90))
  expect(wrap('foo bar baz', 4)).toBe('foo\nbar\nbaz')
})
