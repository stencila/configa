#!/usr/bin/env node

import { Config } from '../config'
import { collectOptions, updateReadme } from '.'

const { args: commands = ['readme'], config } = collectOptions(
  'configa',
  new Config()
)

for (const command of commands) {
  switch (command) {
    case 'readme':
      updateReadme(config)
      break
  }
}
