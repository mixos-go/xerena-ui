import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { colors, semantic } from '@xerena/tokens'

const TokenGallery = () => (
  <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
    <h2>Primitive colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
      {Object.entries(colors).map(([name, shades]) =>
        Object.entries(shades).map(([shade, value]) => (
          <div key={`${name}-${shade}`} style={{ textAlign: 'center' }}>
            <div style={{ background: value, height: 64, borderRadius: 8, border: '1px solid #ddd' }} />
            <small>{`${name}.${shade} — ${value}`}</small>
          </div>
        )),
      )}
    </div>
    <h2>Semantic</h2>
    <pre>{JSON.stringify(semantic.color, null, 2)}</pre>
  </div>
)

const meta: Meta<typeof TokenGallery> = {
  title: 'Design Tokens/Gallery',
  component: TokenGallery,
}

export default meta
type Story = StoryObj<typeof TokenGallery>

export const Default: Story = {}
