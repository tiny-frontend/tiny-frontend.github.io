import {defineUserConfig} from '@vuepress/cli'
import type {DefaultThemeOptions} from '@vuepress/theme-default'
// import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `/images/favicon-16x16.png`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `/images/favicon-32x32.png`,
      },
    ],
    ['link', {rel: 'manifest', href: '/manifest.webmanifest'}],
    ['meta', {name: 'application-name', content: 'tiny frontend'}],
    ['meta', {name: 'apple-mobile-web-app-title', content: 'tiny frontend'}],
    [
      'meta',
      {name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
    ]
  ],

  // site-level locales config
  locales: {
    '/': {
      lang: 'en-US',
      title: 'tiny frontend',
      description: 'Example micro frontend architecture',
    },
  },

  themeConfig: {
    logo: '/images/logo.png',

    repo: 'tiny-frontend',

    docsDir: 'docs',

    // theme-level locales config
    locales: {
      '/': {
        // // navbar
        // navbar: navbar.en,
        //
        // // sidebar
        sidebar: [
          '/guide/about.md',
          '/guide/architecture.md',
          '/guide/deploy.md',
          { text: 'Example Remix host', link: 'https://tiny-frontend-example-host-remix.fly.dev/', },
          { text: 'Example Next.js host', link: 'https://example-host-nextjs.vercel.app/' },
        ],

        // page meta
        editLinkText: 'Edit this page on GitHub',
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd
    },
  }
})
