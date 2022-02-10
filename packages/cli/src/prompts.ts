import type { CommandValues, PromptsResult } from './types'
import prompts from 'prompts'
import { red, yellow } from 'kolorist'
import { canSafelyOverwrite, isValidPackageName, toValidPackageName } from './utils'
import path from 'path'

const getPrompts = async ({
  defaultProjectName,
  targetDir: defaultDir,
  forceOverwrite,
  isTsFlagUsed,
  isWindiCssFlagUsed,
  isEslintFlagUsed,
  isStylelintFlagUsed,
  isCssModuleFlagUsed,
}: CommandValues) => {
  let targetDir = defaultDir

  let result: PromptsResult = {
    projectName: defaultProjectName,
    packageName: defaultProjectName,
    overwrite: forceOverwrite,
    typescript: isTsFlagUsed,
    windiCss: isWindiCssFlagUsed,
    eslint: isEslintFlagUsed,
    stylelint: isStylelintFlagUsed,
    cssModule: isCssModuleFlagUsed,
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
      // {
      //   name: 'frame',
      //   type: 'select',
      //   message: yellow('请选择框架'),
      //   choices: [
      //     { title: 'React', value: 'react' },
      //     { title: 'Vue', value: 'vue' },
      //     { title: 'Svelte', value: 'svelte' }
      //   ]
      // },
      // {
      //   name: 'buildTools',
      //   type: (prev) => prev === 'svelte'? null : 'select',
      //   message: yellow('请选择构建工具'),
      //   choices: [
      //     { title: 'Webpack', value: 'webpack' },
      //     { title: 'Vite', value: 'vite' },
      //     { title: 'Esbuild', value: 'esbuild' },
      //     { title: 'Swc', value: 'swc' }
      //   ]
      // },
      {
        name: 'typescript',
        type: () => (isTsFlagUsed ? null : 'toggle'),
        message: yellow('是否使用TypeScript ?'),
        initial: true,
        active: '是',
        inactive: '否',
      },
      {
        name: 'windiCss',
        type: () => (isWindiCssFlagUsed ? null : 'toggle'),
        message: yellow('是否使用windiCss ?'),
        initial: false,
        active: '是',
        inactive: '否',
      },
      {
        name: 'cssModule',
        type: () => (isCssModuleFlagUsed ? null : 'toggle'),
        message: yellow('是否使用Css Module ?'),
        initial: true,
        active: '是',
        inactive: '否',
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
        message: yellow('是否使用stylelint ?'),
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
