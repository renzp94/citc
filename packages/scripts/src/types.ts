import type { Options as BuildInfoWebpackPluginOptions } from '@renzp/build-info-webpack-plugin'
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

export interface Options {
  /** 打包入口配置 */
  entry: string | Array<string> | AnyObject
  /** 打包输出配置 */
  output?: string
  /** 静态文件目录配置 */
  staticDir?: string
  /** html的title配置 */
  title?: string
  /** index.html目录配置 */
  template?: string
  /** 是否使用typescript */
  typescript?: boolean
  /** 是否使用windicss */
  windiCss?: boolean
  /** 是否使用css module */
  cssModule?: boolean
  /** 是否在控制台打印打包信息，详情见https://www.npmjs.com/package/@renzp/build-info-webpack-plugin */
  webpackBuildInfo?: boolean | BuildInfoWebpackPluginOptions
  /** Js/Ts文件打包配置 */
  jtsLoader: JtsLoader
}

export interface ResolveJtsLoaderOptions {
  typescript?: boolean
  fileType?: string
  jtsLoader: JtsLoader
}
