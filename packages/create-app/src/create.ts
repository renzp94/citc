import type { PromptsResult } from './types'
import fs from 'fs'
import { emptyDir, run } from './utils'
import {
  render,
  renderCitcConfig,
  copyTemplateFile,
  renderHuskyAndLintstagedrc,
  renderPackage,
  renderReadme,
  renderGitignore,
} from './render'
import { gray, green, bold } from 'kolorist'
import { JtsLoader } from '../../scripts/src/types'

export const createProject = async (result: PromptsResult) => {
  // eslint-disable-next-line no-unused-vars
  const { projectName, overwrite, typescript, windiCss, eslint, stylelint, cssModule, jtsLoader } =
    result
  const root = process.env.ROOT

  if (overwrite) {
    console.log(gray(`⌛ 正在清空${root}目录...`))
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  console.log(gray(`⌛ 正在${root}目录中创建项目...`))
  renderPackage(result)
  render('base', typescript, windiCss)
  renderReadme(result)
  renderCitcConfig(typescript, windiCss, cssModule, jtsLoader as unknown as JtsLoader)
  const typeDir = typescript ? 'react-ts' : 'react'
  typescript && render(typeDir)
  if (eslint) {
    copyTemplateFile('.eslintrc.js', `lint/${typescript ? 'ts' : 'js'}`)
    copyTemplateFile('.prettierrc', `lint`)
  }
  if (stylelint) {
    copyTemplateFile('.stylelintrc', 'lint')
  }
  if (typescript) {
    copyTemplateFile('fonts.d.ts', '@types', '@types')
    copyTemplateFile('images.d.ts', '@types', '@types')
    cssModule && copyTemplateFile('css-module.d.ts', '@types', '@types')
  }
  if (eslint || stylelint) {
    renderHuskyAndLintstagedrc(typescript, eslint, stylelint)
    console.log(gray('初始化husky'))
    run('npx husky install')
  }
  console.log(gray('初始化git仓库'))
  await run('git init')
  renderGitignore()
  await run('git add .')
  await run('git commit -m init')

  console.log(
    green(
      `\n✨  项目${bold(projectName)}创建成功!!! 🚀🚀🚀

      👉 cd ${projectName}
      👉 npm install
      👉 npm run dev
      `
    )
  )
}
