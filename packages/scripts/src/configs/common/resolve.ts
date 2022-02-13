import type WebpackChain from 'webpack-chain'
import { getJtsFileType, pathResolve } from '../../utils'

export default (webpackChain: WebpackChain, typescript: boolean) => {
  const fileType = getJtsFileType(typescript)

  webpackChain.resolve.extensions
    .add('.jsx')
    .add('.js')
    .add(`.${fileType}`)
    .add(`.${fileType}x`)
    .end()
    // 配置目录别名
    .alias.set('@', pathResolve(process.cwd(), './src'))
}
