import { JtsLoaderName } from '../../scripts/src/types'
export interface CommandValues {
  argv: unknown
  isTsFlagUsed?: boolean
  targetDir?: string
  defaultProjectName?: string
  forceOverwrite?: boolean
  atomCss?: string
  isEslintFlagUsed?: boolean
  isStylelintFlagUsed?: boolean
  isCssModuleFlagUsed?: boolean
  isCssScopedFlagUsed?: boolean
  isLessFlagUsed?: boolean
  isSassFlagUsed?: boolean
  jtsLoader?: JtsLoaderName
  isCommitlint?: boolean
}

export type CssPreprocessor = 'less' | 'sass'

export interface PromptsResult {
  projectName?: string
  packageName?: string
  overwrite?: boolean
  buildTools?: 'webpack' | 'vite' | 'esbuild' | `swc`
  frame?: 'react' | 'vue' | 'svelte'
  typescript?: boolean
  atomCss?: string
  eslint?: boolean
  stylelint?: boolean
  cssModule?: boolean
  cssScoped?: boolean
  cssPreprocessor?: CssPreprocessor
  jtsLoader?: JtsLoaderName
  commitlint?: boolean
}
