#!/usr/bin/env node

import fs from 'fs'
import globby from 'globby'
import {
  collectOptions,
  helpUsage,
  parseConfig,
  updateJsonSchema,
  updateReadme
} from '.'
import { log } from './common'
import { Config } from './config'
import configSchema from './config.schema.json'
;(() => {
  const { args = ['readme', 'schema'], config } = collectOptions<Config>(
    'configa',
    configSchema
  )

  if (args.includes('help'))
    return console.log(helpUsage(configSchema, args[1]))

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

  let { appName, configPath, jsonSchemaPath, readmePath } = config
  if (appName === undefined) {
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

  const app = parseConfig(configPath)
  if (app === undefined) {
    log.error(`Could not parse application config from: ${configPath}`)
    return
  }

  if (args.includes('readme')) updateReadme(readmePath, appName, app.options)
  if (args.includes('schema')) updateJsonSchema(jsonSchemaPath, app, pkg)
})()
