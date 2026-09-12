import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Xerena UI',
  description: 'Cross-platform design system for React and React Native',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Instrument+Sans:wght@400;500&family=Geist+Mono:wght@400;500&display=swap',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/mark.svg' }],
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Brand', link: '/brand' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
        ],
      },
      {
        text: 'Brand',
        items: [{ text: 'Identity', link: '/brand' }],
      },
    ],
  },
})
