#!/usr/bin/env node
import { inverse, lightBlue, red } from 'kolorist'
import minimist from 'minimist'
import pkg from '../package.json'
import server from './server'
import build from './build'
import { loadEnv, loadConfigFile } from './utils'
import { buildDll } from './configs/common/plugins/dll-plugin'
import showHelp from './help'

const run = async () => {
  try {
    const argv = minimist(process.argv.slice(2))
    if (argv.version || argv.V) {
      console.log(`V${pkg.version}`)
      return true
    }
    if (argv.help || argv.h) {
      showHelp()
      return true
    }
    console.log(`\n${lightBlue(inverse(` ð ð² ð¸ ð ð² ð Scripts v${pkg.version} \n`))}`)
    const [runCommand] = argv._
    const commandMethod = {
      start: server,
      build: build,
    }
    const run = commandMethod[runCommand]
    if (!run) {
      throw new Error(red(`ð¨ ${runCommand}æªç¥å¯å¨å½ä»¤ï¼å¯å¨å½ä»¤ï¼start/build`))
    }

    process.env.NODE_ENV = runCommand === 'start' ? 'development' : 'production'
    // æ¯å¦å¼å¯åå¤§å°åæ
    process.env.SIZE_ANALYZER = argv['build-size-analyzer'] ? 'open' : 'close'
    // æ¯å¦å¼å¯æåæ¶é´åæ
    process.env.BUILD_TIME_ANALYZER = argv['build-time-analyzer'] ? 'open' : 'close'
    // ä½¿ç¨DLLçæçä¾èµå
    process.env.DLL = argv['dll'] ?? ''
    // å¼ºå¶éæ°æå»ºDLL
    process.env.DLL_BUILD = argv['force-dll'] ? 'open' : 'close'

    // å è½½.env.*
    loadEnv(process.env.NODE_ENV)
    // å è½½.env
    loadEnv()
    const webpackChain = loadConfigFile(argv?.config)
    if (process.env.DLL) {
      await buildDll(process.env.DLL.split(','))
    }
    run(webpackChain)
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
}

try {
  run()
} catch (e) {
  console.log(e)
}
