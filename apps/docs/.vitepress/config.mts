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
          { text: 'Motion', link: '/guide/motion' },
          { text: 'Styling', link: '/guide/styling' },
          { text: 'Native (React Native)', link: '/guide/native' },
        ],
      },
      {
        text: 'Components',
        items: [
          {
            text: 'Typography',
            items: [
              { text: 'Text', link: '/guide/components/typography/text' },
              { text: 'Heading', link: '/guide/components/typography/heading' },
              { text: 'Badge', link: '/guide/components/typography/badge' },
              { text: 'Divider', link: '/guide/components/typography/divider' },
              { text: 'Skeleton', link: '/guide/components/typography/skeleton' },
              { text: 'Kbd', link: '/guide/components/typography/kbd' },
            ],
          },
          {
            text: 'Layout',
            items: [
              { text: 'Container', link: '/guide/components/layout/container' },
              { text: 'Stack', link: '/guide/components/layout/stack' },
              { text: 'Grid', link: '/guide/components/layout/grid' },
            ],
          },
          {
            text: 'Actions',
            items: [
              { text: 'Button', link: '/guide/components/actions/button' },
              { text: 'Icon Button', link: '/guide/components/actions/icon-button' },
              { text: 'Link', link: '/guide/components/actions/link' },
              { text: 'Button Group', link: '/guide/components/actions/button-group' },
            ],
          },
          {
            text: 'Form',
            items: [
              { text: 'Field', link: '/guide/components/form/field' },
              { text: 'Input', link: '/guide/components/form/input' },
              { text: 'Textarea', link: '/guide/components/form/textarea' },
              { text: 'Select', link: '/guide/components/form/select' },
              { text: 'Checkbox', link: '/guide/components/form/checkbox' },
              { text: 'Radio', link: '/guide/components/form/radio' },
              { text: 'Switch', link: '/guide/components/form/switch' },
              { text: 'Slider', link: '/guide/components/form/slider' },
              { text: 'Combobox', link: '/guide/components/form/combobox' },
              { text: 'Radio Group', link: '/guide/components/form/radio-group' },
              { text: 'Checkbox Group', link: '/guide/components/form/checkbox-group' },
              { text: 'Input Group', link: '/guide/components/form/input-group' },
              { text: 'Number Input', link: '/guide/components/form/number-input' },
            ],
          },
          {
            text: 'Surfaces',
            items: [
              { text: 'Card', link: '/guide/components/surfaces/card' },
              { text: 'Avatar', link: '/guide/components/surfaces/avatar' },
            ],
          },
          {
            text: 'Data',
            items: [
              { text: 'Table', link: '/guide/components/data/table' },
              { text: 'Pagination', link: '/guide/components/data/pagination' },
            ],
          },
          {
            text: 'Feedback',
            items: [
              { text: 'Spinner', link: '/guide/components/feedback/spinner' },
              { text: 'Progress', link: '/guide/components/feedback/progress' },
              { text: 'Message', link: '/guide/components/feedback/message' },
              { text: 'Tooltip', link: '/guide/components/feedback/tooltip' },
              { text: 'Toast', link: '/guide/components/feedback/toast' },
              { text: 'Dialog', link: '/guide/components/feedback/dialog' },
              { text: 'Drawer', link: '/guide/components/feedback/drawer' },
              { text: 'Popover', link: '/guide/components/feedback/popover' },
            ],
          },
          {
            text: 'Navigation',
            items: [
              { text: 'Tabs', link: '/guide/components/navigation/tabs' },
              { text: 'Accordion', link: '/guide/components/navigation/accordion' },
              { text: 'Menu', link: '/guide/components/navigation/menu' },
              { text: 'Breadcrumb', link: '/guide/components/navigation/breadcrumb' },
            ],
          },
        ],
      },
      {
        text: 'Brand',
        items: [{ text: 'Identity', link: '/brand' }],
      },
    ],
  },
})
