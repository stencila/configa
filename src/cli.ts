#!/usr/bin/env node

import fs from 'fs'
import globby from 'globby'
import { collectOptions, parseConfig, updateJsonSchema, updateReadme } from '.'
import { log } from './common'
import { Config } from './config'
import configSchema from './config.schema.json'
;(() => {
  const { args = ['readme', 'schema'], config } = collectOptions<Config>(
    'configa',
    configSchema
  )

  let { appName, configPath, jsonSchemaPath, readmePath } = config
  if (appName === undefined) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const match = pkg.name.match(/(@\w+\/)?(\w+)$/)
    if (match === null) {
      log.error(`Could not parse app name from package name: ${pkg.name}`)
      return
    }
    appName = match[2] as string
  }

  if (configPath === undefined) {
    const configs = globby.sync('**/(C|c)onfig.ts')
    if (configs.length === 0) {
      log.error(`No config file supplied and none could be found`)
      return
    } else {
      configPath = configs[0]
    }
  } else if (!fs.existsSync(configPath)) {
    log.error(`Config file does not exist: ${configPath}`)
    return
  }

  if (jsonSchemaPath === undefined) {
    jsonSchemaPath = configPath.replace(/\.ts$/, '.schema.json')
  }

  const options = parseConfig(configPath)
  if (args.includes('readme')) updateReadme(readmePath, appName, options)
  if (args.includes('schema')) updateJsonSchema(jsonSchemaPath, options)
})()
