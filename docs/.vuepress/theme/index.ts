import type { ThemeObject } from '@vuepress/core'
import { path } from '@vuepress/utils'

const localTheme: ThemeObject = {
  name: 'vuepress-theme-local',
  extends: '@vuepress/theme-default',
  templateBuild: path.resolve(__dirname, 'template.build.html'),
}

export default localTheme
