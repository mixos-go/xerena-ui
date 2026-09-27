'use client'

import { Body, Cell, Head, Row, Table } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Table variant="striped" size="md">
  <Head>
    <Row>
      <Cell as="th">Name</Cell>
      <Cell as="th">Status</Cell>
    </Row>
  </Head>
  <Body>
    <Row>
      <Cell>Ada</Cell>
      <Cell>Active</Cell>
    </Row>
    <Row expandable expandContent={<span>Ada details.</span>}>
      <Cell>Grace</Cell>
      <Cell>Invited</Cell>
    </Row>
  </Body>
</Table>`

export function TableDemo() {
  return (
    <Preview title="Striped table" code={code}>
      <Table variant="striped" size="md">
        <Head>
          <Row>
            <Cell as="th">Name</Cell>
            <Cell as="th">Status</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Ada</Cell>
            <Cell>Active</Cell>
          </Row>
          <Row expandable expandContent={<span>Ada details.</span>}>
            <Cell>Grace</Cell>
            <Cell>Invited</Cell>
          </Row>
        </Body>
      </Table>
    </Preview>
  )
}
