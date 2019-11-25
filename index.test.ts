/**
 * These tests use file snapshots as a convenient way to
 * check expected outputs of different types. During development
 * it can be useful to update these snapshots on the fly using:
 *
 * ```bash
 * npx jest --watch --updateSnapshot
 * ```
 */

import { addHandler, removeHandler } from '@stencila/logga';
import fs from 'fs';
import { toMatchFile } from 'jest-file-snapshot';
import path from 'path';
import { generateCliHelp, generateJson, generateMdTable, insertMd, parseConfig, wrap, updateReadme } from '.';

// Get the path to a fixture file
const fixture = (name: string): string => path.join(__dirname, 'fixtures', name)

// Extend expect with file snapshot matcher
expect.extend({ toMatchFile })

// Get the path to a snapshot file
const snapshot = (name: string): string =>
  path.join(__dirname, 'snapshots', name)

// Parse the test configs for use across below tests
const configOne = parseConfig(fixture('config-one.ts'))

test('parseConfig', async () => {
  // Collect a certain number of log events
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

  const events = logMessages(7)
  expect(parseConfig(fixture('config-errors.ts')))
  expect(await events).toEqual([
    'Option is missing description: ConfigErrors.optionA',
    'Option has no default value: ConfigErrors.optionB',
    "Option has type 'any': ConfigErrors.optionC",
    "Option has type 'any': ConfigErrors.optionD",
    'Option has no default value: ConfigErrors.optionD',
    'Option has un-JSON-parsable default value: ConfigErrors.optionE',
    'Option has long description: ConfigErrors.optionF'
  ])
})

test('generateCliHelp', () => {
  expect(generateCliHelp(configOne)).toMatchFile(snapshot('config-one.txt'))
})

test('generateJson', () => {
  expect(generateJson(configOne)).toMatchFile(snapshot('config-one.json'))
})

test('generateMdTable', () => {
  expect(generateMdTable(configOne)).toMatchFile(
    snapshot('config-one-table.md')
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
  fs.copyFileSync(fixture('README.md'), snapshot('README-actual.md'))
  updateReadme({
    appName: 'test',
    configPath: fixture('config-one.ts'),
    readmePath: fixture('README-actual.md')
  })
  const md =  fs.readFileSync(snapshot('README-actual.md'), 'utf8')
  expect(md).toMatchFile(
    snapshot('README-expected.md')
  )
})

test('wrap', () => {
  expect(wrap('a')).toBe('a')
  expect(wrap('a'.repeat(90))).toBe('a'.repeat(90))
  expect(wrap('foo bar baz', 4)).toBe('foo\nbar\nbaz')
})
