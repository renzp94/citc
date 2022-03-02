import type { CommandValues } from './types'
import minimist from 'minimist'
import { red } from 'kolorist'

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

  // 是否使用eslint
  const isEslintFlagUsed = typeof argv.eslint === 'boolean'
  // 是否使用stylelint
  const isStylelintFlagUsed = typeof argv.stylelint === 'boolean'
  // 是否使用Css Module
  const isCssModuleFlagUsed = typeof argv.cssModule === 'boolean'
  // 是否使用Less
  const isLessFlagUsed = typeof argv.less === 'boolean'
  // 是否使用Sass
  const isSassFlagUsed = typeof argv.sass === 'boolean'
  const jtsLoader = argv.jtsLoader
  // css原子化框架
  const atomCssFrameworks = ['windicss', 'tailwindcss']
  if (argv.css && !atomCssFrameworks.includes(argv.css)) {
    console.log(red(`🚨 css取值只能为${atomCssFrameworks.join('/')}，当前值为${argv.css}`))
    process.exit(-1)
  }
  // 是否使用commit lint
  const isCommitlint = typeof argv.commitlint === 'boolean'

  return {
    argv,
    isTsFlagUsed,
    targetDir,
    defaultProjectName,
    forceOverwrite,
    atomCss: argv.css,
    isEslintFlagUsed,
    isStylelintFlagUsed,
    isCssModuleFlagUsed,
    isLessFlagUsed,
    isSassFlagUsed,
    jtsLoader,
    isCommitlint,
  }
}

export default getCommandValues
