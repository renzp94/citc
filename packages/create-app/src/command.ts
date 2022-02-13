import type { CommandValues } from './types'
import minimist from 'minimist'

const getCommandValues = (): CommandValues => {
  // 所有命令行参数
  const argv = minimist(process.argv.slice(2), { boolean: true })
  // 是否使用ts
  const isTsFlagUsed = typeof (argv.default || argv.ts) === 'boolean'
  // 目标目录
  const [targetDir] = argv._
  // 默认项目名称
  const defaultProjectName = targetDir ?? 'citc-project'
  // 是否覆盖
  const forceOverwrite = argv.force
  // 是否使用WindiCss
  const isWindiCssFlagUsed = typeof argv.windiCss === 'boolean'
  // 是否使用eslint
  const isEslintFlagUsed = typeof argv.eslint === 'boolean'
  // 是否使用stylelint
  const isStylelintFlagUsed = typeof argv.stylelint === 'boolean'
  // 是否使用Css Module
  const isCssModuleFlagUsed = typeof argv.cssModule === 'boolean'
  const jtsLoader = argv.jtsLoader

  return {
    argv,
    isTsFlagUsed,
    targetDir,
    defaultProjectName,
    forceOverwrite,
    isWindiCssFlagUsed,
    isEslintFlagUsed,
    isStylelintFlagUsed,
    isCssModuleFlagUsed,
    jtsLoader,
  }
}

export default getCommandValues
