import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '@xerena/react'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Breadcrumb>

export const Default: T = {
  args: {
    children: (
      <>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/components">Components</Breadcrumb.Item>
        <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
      </>
    ),
  },
}
export const Chevron: T = {
  args: {
    children: (
      <>
        <Breadcrumb.Item href="/" separator="chevron">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/docs" separator="chevron">Docs</Breadcrumb.Item>
        <Breadcrumb.Item current>Page</Breadcrumb.Item>
      </>
    ),
  },
}
export const Dot: T = {
  args: {
    children: (
      <>
        <Breadcrumb.Item href="/" separator="dot">Home</Breadcrumb.Item>
        <Breadcrumb.Item current>Dashboard</Breadcrumb.Item>
      </>
    ),
  },
}
export const TwoLevels: T = {
  args: {
    children: (
      <>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item current>Settings</Breadcrumb.Item>
      </>
    ),
  },
}