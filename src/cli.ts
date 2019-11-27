#!/usr/bin/env node

import { Config } from '../config'
import { collect, updateReadme } from '.'

const { args: commands = ['readme'], config } = collect('configa', new Config())

for (const command of commands) {
  switch (command) {
    case 'readme':
      updateReadme(config)
      break
  }
}
