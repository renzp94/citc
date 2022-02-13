#!/usr/bin/env node
import { inverse, lightBlue, red } from 'kolorist'
import minimist from 'minimist'
import pkg from '../package.json'
import server from './server'
import build from './build'
import { loadEnv } from './utils'

const run = async () => {
  try {
    console.log(`\n${lightBlue(inverse(` 4🎉 🅲 🅸 🆃 🅲 🏆 Scripts v${pkg.version} \n`))}`)
    const argv = minimist(process.argv.slice(2))
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
    process.env.SIZE_ANALYZER = argv['size-analyzer'] ? 'open' : 'close'
    // 是否开启打包时间分析
    process.env.BUILD_TIME_ANALYZER = argv['build-time-analyzer'] ? 'open' : 'close'

    // 加载.env.*
    loadEnv(process.env.NODE_ENV)
    // 加载.env
    loadEnv()
    run(argv?.config)
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
