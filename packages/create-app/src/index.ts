#!/usr/bin/env node
import { inverse, lightBlue } from 'kolorist'
import getCommandValues from './command'
import getPrompts from './prompts'
import { createProject } from './create'
import minimist from 'minimist'
import pkg from '../package.json'
import showHelp from './help'

const init = async () => {
  try {
    const argv = minimist(process.argv.slice(2), { boolean: true })
    if (argv.version || argv.V) {
      console.log(`V${pkg.version}`)
      return true
    }
    if (argv.help || argv.h) {
      showHelp()
      return true
    }
    console.log(`\n${lightBlue(inverse(` 🎉 🅲 🅸 🆃 🅲 🏆  Create App v${pkg.version} \n`))}\n`)
    const values = getCommandValues()
    const result = await getPrompts(values)
    createProject(result)
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
}

try {
  init()
} catch (e) {
  console.log(e)
}
