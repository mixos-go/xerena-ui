import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { colors, semantic, motion } from '@xerena/tokens'

type Bezier = [number, number, number, number]

const CubicBezierPreview: React.FC<{ points: Bezier }> = ({ points }) => {
  const [x1, y1, x2, y2] = points
  const samples = 24
  const coords: string[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    const x = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t
    const y = 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t
    coords.push(`${(x * 100).toFixed(1)},${((1 - y) * 100).toFixed(1)}`)
  }
  return (
    <svg
      viewBox="0 0 100 100"
      width={64}
      height={64}
      role="img"
      aria-label={`cubic-bezier(${points.join(', ')})`}
    >
      <line x1="0" y1="100" x2="100" y2="0" stroke="#f4efe6" strokeWidth="4" />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke="#c04e1d"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
    <h2>Motion — duration</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
      {Object.entries(motion.duration).map(([key, value]) => (
        <div
          key={key}
          style={{ background: colors.sand[100], borderRadius: 8, padding: '10px 14px', minWidth: 96, textAlign: 'center' }}
        >
          <strong style={{ display: 'block', fontSize: 18 }}>{`${value}ms`}</strong>
          <small>{key}</small>
        </div>
      ))}
    </div>
    <h2>Motion — easing</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {Object.entries(motion.easing).map(([key, value]) => (
        <div
          key={key}
          style={{ display: 'flex', gap: 10, alignItems: 'center', background: colors.sand[100], borderRadius: 8, padding: 10 }}
        >
          <CubicBezierPreview points={value as Bezier} />
          <code style={{ fontSize: 12 }}>{`${key} — cubic-bezier(${value.join(', ')})`}</code>
        </div>
      ))}
    </div>
  </div>
)

const meta: Meta<typeof TokenGallery> = {
  title: 'Design Tokens/Gallery',
  component: TokenGallery,
}

export default meta
type Story = StoryObj<typeof TokenGallery>

export const Default: Story = {}
