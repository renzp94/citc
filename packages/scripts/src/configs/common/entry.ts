import { red } from 'kolorist'
import type WebpackChain from 'webpack-chain'
import type { AnyObject, Options } from '../../types'
import { getJtsFileType, pathResolve } from '../../utils'

export default (webpackChain: WebpackChain, opts: Options) => {
  const { entry, output = 'dist', typescript } = opts
  const fileType = getJtsFileType(typescript)

  // 配置环境
  webpackChain.mode(process.env.NODE_ENV as 'development' | 'production')

  // 配置入口文件
  if (entry) {
    switch (true) {
      case typeof entry === 'string':
        // eslint-disable-next-line no-case-declarations
        const key = (entry as string).split('/').pop().replace(`.${fileType}x`, '')
        webpackChain.entry(key).add(entry as string)
        break
      case entry instanceof Array:
        // eslint-disable-next-line no-case-declarations
        const entryOption = (entry as Array<string>).map((item: string) => {
          if (typeof item !== 'string') {
            console.log(red(`🚨 entry配置有误，如果配置为Array，应该配置为Array<string>类型`))
            process.exit(-1)
          }
          const key = item.split('/').pop().replace(`.${fileType}x`, '')
          return {
            [key]: item,
          }
        })
        entryOption.forEach((item: AnyObject) => {
          const key = Object.keys(item)[0]
          webpackChain.entry(key).add(item[key] as string)
        })
        break
      case typeof entry === 'object':
        entryOption.forEach((item: AnyObject) => {
          const key = Object.keys(item)[0]
          webpackChain.entry(key).add(item[key] as string)
        })
        break
    }
  } else {
    webpackChain.entry('main').add(`./src/main.${fileType}x`)
  }

  // 配置打包输出文件
  webpackChain.output
    .path(pathResolve(process.cwd(), output))
    .filename('assets/js/[name].[contenthash].js')
    .chunkFilename('assets/js/[name].[contenthash].js')
    // 构建前先清空目录
    .set('clean', process.env.NODE_ENV === 'production')
    .end()
    // 将runtime代码抽离成一个
    .optimization.runtimeChunk(true)
    // vendors包的hash值保持不变，用于优化公共库的长期缓存
    .set('chunkIds', 'deterministic')
}
