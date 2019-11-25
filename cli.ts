import { Config } from './config'
import { collect, updateReadme } from '.'

const { args: commands = ['readme'], config } = collect('configa', new Config())

for (const command of commands) {
  if (command === 'readme') updateReadme(config)
}
