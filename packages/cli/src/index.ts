#!/usr/bin/env node
import { inverse, lightBlue } from 'kolorist'
import getCommandValues from './command'
import getPrompts from './prompts'
import { createProject } from './create'
import pkg from '../package.json'

const init = async () => {
  try {
    console.log(`\n${lightBlue(inverse(` 🎉 🅲 🅸 🆃 🅲 🏆  Cli v${pkg.version} \n`))}\n`)
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
