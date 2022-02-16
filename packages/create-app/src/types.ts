import { JtsLoaderName } from '../../scripts/src/types'
export interface CommandValues {
  argv: unknown
  isTsFlagUsed?: boolean
  targetDir?: string
  defaultProjectName?: string
  forceOverwrite?: boolean
  isWindiCssFlagUsed?: boolean
  isEslintFlagUsed?: boolean
  isStylelintFlagUsed?: boolean
  isCssModuleFlagUsed?: boolean
  isLessFlagUsed?: boolean
  isSassFlagUsed?: boolean
  jtsLoader?: JtsLoaderName
}

export type CssPreprocessor = 'less' | 'sass'

export interface PromptsResult {
  projectName?: string
  packageName?: string
  overwrite?: boolean
  buildTools?: 'webpack' | 'vite' | 'esbuild' | `swc`
  frame?: 'react' | 'vue' | 'svelte'
  typescript?: boolean
  windiCss?: boolean
  eslint?: boolean
  stylelint?: boolean
  cssModule?: boolean
  cssPreprocessor?: CssPreprocessor
  jtsLoader?: JtsLoaderName
}
