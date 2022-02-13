export type JtsLoaderName = 'babel' | 'esbuild' | 'swc'

export interface AnyObject {
  [key: string]: unknown
}

export interface BabelOptions {
  loaderOptions?: AnyObject
  presetEnv?: AnyObject
  transformRuntime?: AnyObject
  minimizerOption?: AnyObject
}

export interface EsbuildOptions {
  loaderOptions?: AnyObject
  minimizerOption?: AnyObject
}

export interface JtsLoader {
  loader: JtsLoaderName
  babel: BabelOptions
  esbuild: EsbuildOptions
  swc: AnyObject
}

export interface Options {
  entry: string | Array<string> | OptionEntry
  output?: string
  staticDir?: string
  title?: string
  template?: string
  typescript?: boolean
  windiCss?: boolean
  cssModule?: boolean
  webpackBuildInfo?: boolean
  jtsLoader: JtsLoader
}

export interface ResolveJtsLoaderOptions {
  typescript?: boolean
  fileType?: string
  jtsLoader: JtsLoader
}

export interface OptionEntry {
  [key: string]: string
}

export interface WebpackBuildInfo {
  name: string
  version: string
  branchName: string
  lastCommitHash8: string
  time: string
}
