'use client'

import { useState } from 'react'
import { Pagination } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Pagination total={240} pageSize={20} current={page} onChange={setPage} siblingCount={1} />`

export function PaginationDemo() {
  const [page, setPage] = useState(1)
  return (
    <Preview title="Change page" code={code}>
      <Pagination total={240} pageSize={20} current={page} onChange={setPage} siblingCount={1} />
      <p>Page: {page}</p>
    </Preview>
  )
}
