import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Xerena UI',
  description: 'Cross-platform design system for React and React Native',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/getting-started' }],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
        ],
      },
    ],
  },
})