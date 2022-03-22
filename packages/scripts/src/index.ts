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
    console.log(`\n${lightBlue(inverse(` 🎉 🅲 🅸 🆃 🅲 🏆 Scripts v${pkg.version} \n`))}`)
    const [runCommand] = argv._
    const commandMethod = {
      start: server,
      build: build,
    }
    const run = commandMethod[runCommand]
    if (!run) {
      throw new Error(red(`🚨 ${runCommand}未知启动命令，启动命令：start/build`))
    }

    process.env.NODE_ENV = runCommand === 'start' ? 'development' : 'production'
    // 是否开启包大小分析
    process.env.SIZE_ANALYZER = argv['build-size-analyzer'] ? 'open' : 'close'
    // 是否开启打包时间分析
    process.env.BUILD_TIME_ANALYZER = argv['build-time-analyzer'] ? 'open' : 'close'
    // 使用DLL生成的依赖包
    process.env.DLL = argv['dll'] ?? ''
    // 强制重新构建DLL
    process.env.DLL_BUILD = argv['force-dll'] ? 'open' : 'close'

    // 加载.env.*
    loadEnv(process.env.NODE_ENV)
    // 加载.env
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
