import type { PromptsResult } from './types'
import fs from 'fs'
import { clearDir } from './utils'
import {
  render,
  renderCitcConfig,
  renderPackage,
  renderReadme,
  renderAtomCss,
  renderLint,
  renderGitRepo,
} from './render'
import { gray, green, bold } from 'kolorist'

export const createProject = async (result: PromptsResult) => {
  const { projectName, overwrite, typescript } = result
  const { ROOT } = process.env

  if (overwrite) {
    console.log(gray(`⌛ 正在清除${ROOT}目录...`))
    clearDir(ROOT)
  }
  console.log(gray(`⌛ 正在${ROOT}目录中创建${projectName}项目...`))
  if (!fs.existsSync(ROOT)) {
    fs.mkdirSync(ROOT)
  }
  renderPackage(result)
  render('base', typescript)
  const typeDir = typescript ? 'react-ts' : 'react'
  typescript && render(typeDir)
  renderReadme(result)
  renderCitcConfig(result)
  renderAtomCss(result)
  renderLint(result)
  console.log(gray('⌛ 正在初始化git仓库'))
  await renderGitRepo()

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
