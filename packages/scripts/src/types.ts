import type WebpackChain from 'webpack-chain'
import type { Options as BuildInfoWebpackPluginOptions } from '@renzp/build-info-webpack-plugin'
import type { Options as HtmlOptions } from 'html-webpack-plugin'
export type JtsLoaderName = 'babel' | 'esbuild' | 'swc'

export interface AnyObject {
  [key: string]: unknown
}

export interface BabelOptions {
  /** babel-loader的配置 */
  loaderOptions?: AnyObject
  /** @babel/preset-env的配置 */
  presetEnv?: AnyObject
  /** @babel/plugin-transform-runtime的配置 */
  transformRuntime?: AnyObject
  /** terser-webpack-plugin的压缩配置 */
  minimizerOption?: AnyObject
}

export interface EsbuildOptions {
  /** esbuild-loader的配置 */
  loaderOptions?: AnyObject
  /** esbuild-loader的ESBuildMinifyPlugin插件的压缩配置 */
  minimizerOption?: AnyObject
}

export interface JtsLoader {
  /** 处理Js/Ts的loader名称 */
  loader: JtsLoaderName
  /** babel配置 */
  babel: BabelOptions
  /** esbuild配置 */
  esbuild: EsbuildOptions
  /** swc配置 */
  swc: AnyObject
}

export type AtomCss = 'windicss' | 'tailwindcss'

export interface CssModuleOptions {
  mode: 'local' | 'global' | 'pure' | 'icss'
  auto: boolean | RegExp
  exportGlobals: boolean
  localIdentName: string
  namedExport: boolean
  exportLocalsConvention: 'asIs' | 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
}

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
  /** 是否使用css module */
  cssModule?: boolean | CssModuleOptions
  // eslint-disable-next-line no-unused-vars
  webpackChain?: (webpackChain: WebpackChain) => void
  /** 是否在控制台打印打包信息，详情见https://www.npmjs.com/package/@renzp/build-info-webpack-plugin */
  webpackBuildInfo?: boolean | BuildInfoWebpackPluginOptions
  /** Js/Ts文件打包配置 */
  jtsLoader?: JtsLoader
  /** less配置 */
  less?: boolean | AnyObject
  /** sass配置 */
  sass?: boolean | AnyObject
  // 配置构建DLL的依赖(使用pnpm会检测版本自动构建，其他包管理工具请再更新包后使用--force-dll强制构建)
  dll?: string | Array<string>
  // 是否使用css scoped
  cssScoped?: boolean
}

export interface ResolveJtsLoaderOptions {
  typescript?: boolean
  fileType?: string
  jtsLoader?: JtsLoader
  cssScoped?: boolean
}
