import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '@xerena/react'

const meta: Meta<typeof Pagination> = {
  title: 'Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Pagination>

export const Page: T = {
  render: () => {
    const [current, setCurrent] = useState(3)
    return <Pagination total={100} pageSize={10} current={current} onChange={setCurrent} />
  },
}
export const Simple: T = {
  render: () => {
    const [current, setCurrent] = useState(2)
    return <Pagination total={100} pageSize={10} current={current} onChange={setCurrent} variant="simple" />
  },
}
export const WithPreview: T = {
  render: () => {
    const [current, setCurrent] = useState(1)
    return (
      <Pagination
        total={100}
        pageSize={10}
        current={current}
        onChange={setCurrent}
        renderPagePreview={(page) => (
          <div style={{ padding: 8, fontSize: 13 }}>
            Preview of page {page}: {((page - 1) * 10) + 1} - {page * 10}
          </div>
        )}
      />
    )
  },
}
export const ManyPages: T = {
  render: () => {
    const [current, setCurrent] = useState(12)
    return <Pagination total={500} pageSize={10} current={current} onChange={setCurrent} siblingCount={2} />
  },
}