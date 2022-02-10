import type WebpackChain from 'webpack-chain'
import { pathResolve } from '../../utils'

export default (webpackChain: WebpackChain, fileType = 'js') => {
  webpackChain.resolve.extensions
    .add('.jsx')
    .add('.js')
    .add(`.${fileType}`)
    .add(`.${fileType}x`)
    .end()
    // 配置目录别名
    .alias.set('@', pathResolve(process.cwd(), './src'))
}
