export type JtsLoader = 'babel' | 'esbuild' | 'swc'
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

export interface JtsLoaderOptions {
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
