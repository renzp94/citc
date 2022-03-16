import type { CommandValues, PromptsResult } from './types'
import prompts from 'prompts'
import { red, yellow, blue, magenta, gray } from 'kolorist'
import { canSafelyOverwrite, isValidPackageName, toValidPackageName } from './utils'
import path from 'path'
import { cyan } from 'kolorist'

const getPrompts = async ({
  defaultProjectName,
  targetDir: defaultDir,
  forceOverwrite,
  isTsFlagUsed,
  atomCss,
  isEslintFlagUsed,
  isStylelintFlagUsed,
  isCssModuleFlagUsed,
  isCssScopedFlagUsed,
  isLessFlagUsed,
  isSassFlagUsed,
  jtsLoader,
  isCommitlint,
}: CommandValues) => {
  let targetDir = defaultDir

  let cssPreprocessor
  if (isLessFlagUsed) {
    cssPreprocessor = 'less'
  }

  if (isSassFlagUsed) {
    cssPreprocessor = 'sass'
  }

  let result: PromptsResult = {
    projectName: defaultProjectName,
    packageName: defaultProjectName,
    overwrite: forceOverwrite,
    typescript: isTsFlagUsed,
    atomCss,
    eslint: isEslintFlagUsed,
    stylelint: isStylelintFlagUsed,
    cssModule: isCssModuleFlagUsed,
    cssScoped: isCssScopedFlagUsed,
    cssPreprocessor,
    jtsLoader: jtsLoader,
    commitlint: isCommitlint,
  }

  const promptValues = await prompts(
    [
      {
        name: 'projectName',
        type: targetDir ? null : 'text',
        message: yellow('请输入项目名称: '),
        initial: defaultProjectName,
        onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName),
      },
      {
        name: 'overwrite',
        type: () => (canSafelyOverwrite(targetDir) || forceOverwrite ? null : 'confirm'),
        message: () => {
          const dirForPrompt = targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`

          return red(`🚨 ${dirForPrompt} 不为空. 是否删除${dirForPrompt}目录下的文件并继续?`)
        },
      },
      {
        name: 'overwriteChecker',
        type: (_prev, values) => {
          if (values?.overwrite === false) {
            throw new Error(red('👻 操作取消'))
          }
          return null
        },
      },
      {
        name: 'packageName',
        type: () => (isValidPackageName(targetDir) ? null : 'text'),
        message: yellow('Package name:'),
        initial: () => toValidPackageName(targetDir),
        validate: (dir) => isValidPackageName(dir) || 'package.json name错误',
      },
      {
        name: 'typescript',
        type: () => (isTsFlagUsed ? null : 'toggle'),
        message: yellow('是否使用TypeScript ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'atomCss',
        type: () => (atomCss ? null : 'select'),
        message: yellow('请选择Css原子化框架 ?'),
        hint: '一个实用优先的Css框架',
        choices: [
          { title: gray('无'), value: undefined },
          { title: cyan('windicss'), value: 'windicss' },
          { title: magenta('tailwindcss'), value: 'tailwindcss' },
        ],
      },
      {
        name: 'cssPreprocessor',
        type: () => (cssPreprocessor ? null : 'select'),
        message: yellow('请选择Css预处理器'),
        hint: '默认支持Postcss Autoprefixer',
        choices: [
          { title: gray('无'), value: undefined },
          { title: cyan('Less'), value: 'less' },
          { title: magenta('Sass'), value: 'sass' },
        ],
      },
      {
        name: 'cssModule',
        type: () => (isCssModuleFlagUsed ? null : 'toggle'),
        message: yellow('是否使用Css Module ?'),
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        name: 'cssScoped',
        type: () => (isCssScopedFlagUsed ? null : 'toggle'),
        message: yellow('是否使用Css Scoped ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'jtsLoader',
        type: 'select',
        message: yellow('请选择Js/Ts文件的loader'),
        hint: '用于编译时处理Js/Ts文件',
        choices: [
          { title: cyan('Babel-loader'), value: 'babel' },
          { title: yellow('Esbuild-loader'), value: 'esbuild' },
          { title: blue('Swc-loader'), value: 'swc' },
        ],
      },
      {
        name: 'eslint',
        type: () => (isEslintFlagUsed ? null : 'toggle'),
        message: yellow('是否使用Eslint+Prettier ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'stylelint',
        type: () => (isStylelintFlagUsed ? null : 'toggle'),
        message: yellow('是否使用Stylelint ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'commitlint',
        type: () => (isCommitlint ? null : 'toggle'),
        message: yellow('是否使用Commitlint ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
    ],
    {
      onCancel: () => {
        throw new Error(red('👻 操作取消'))
      },
    }
  )

  const cwd = process.cwd()
  process.env.ROOT = path.join(cwd, targetDir)

  result = {
    ...result,
    ...promptValues,
  }

  if (result.packageName === defaultProjectName) {
    result.packageName = result.projectName
  }

  return result
}

export default getPrompts
