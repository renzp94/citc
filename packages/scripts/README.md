# `@renzp/scripts`

> 基于 Webpack5 的打包脚本

## Options

```ts
import type { Options as HtmlOptions } from 'html-webpack-plugin'

export interface Options {
  /** 打包入口配置 */
  entry: string | Array<string> | AnyObject
  /** 打包输出配置 */
  output?: string
  /** 静态文件目录配置 */
  publicDir?: string
  /** html配置，template默认为index.html,favicon默认为favicon.ico，其他参数详情参考：html-webpack-plugin配置 */
  html?: HtmlOptions
  /** 是否使用typescript */
  typescript?: boolean
  /** 原子化框架 */
  atomCss: AtomCss
  tailwindcss?: boolean
  /** 是否使用css module */
  cssModule?: boolean | CssModuleOptions
  // eslint-disable-next-line no-unused-vars
  webpackChain?: (webpackChain: WebpackChain) => void
  /** 是否在控制台打印打包信息，详情见https://www.npmjs.com/package/@renzp/build-info-webpack-plugin */
  webpackBuildInfo?: boolean | BuildInfoWebpackPluginOptions
  /** Js/Ts文件打包配置 */
  jtsLoader: JtsLoader
  /** less配置 */
  less: boolean | AnyObject
  /** sass配置 */
  sass: boolean | AnyObject
  // 配置构建DLL的依赖
  dll: string | Array<string>
}
```
