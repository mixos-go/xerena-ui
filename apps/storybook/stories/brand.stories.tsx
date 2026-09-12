import type { Meta, StoryObj } from '@storybook/react'
import { colors, typography, elevation, radius } from '@xerena/tokens'
import { XerenaMark, XerenaWordmark, XerenaLockup } from '@xerena/brand'

const Showcase = () => (
  <div style={{ fontFamily: '"Instrument Sans", sans-serif', maxWidth: 720, padding: 40 }}>
    <h1 style={{ fontFamily: '"Fraunces", serif', fontWeight: 500, letterSpacing: '-0.02em' }}>
      Xerena identity
    </h1>

    <h2>Mark</h2>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <XerenaMark size="sm" />
      <XerenaMark size="md" />
      <XerenaMark size="lg" />
      <div style={{ background: colors.sand[900], borderRadius: 12, padding: 16 }}>
        <XerenaMark tone="onDark" />
      </div>
    </div>

    <h2>Wordmark</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <XerenaWordmark weight={500} style={{ fontSize: 32 }} />
      <XerenaWordmark variant="italic" weight={600} style={{ fontSize: 32 }} />
    </div>

    <h2>Lockup</h2>
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <XerenaLockup />
      <XerenaLockup variant="stacked" markSize="sm" />
    </div>

    <h2>Palette</h2>
    {Object.entries(colors).map(([name, shades]) => (
      <div key={name} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {Object.entries(shades).map(([shade, value]) => (
          <div
            key={shade}
            style={{
              width: 72,
              height: 72,
              background: value,
              borderRadius: 4,
              boxShadow: elevation.xs,
            }}
            title={`${name}.${shade} — ${value}`}
          />
        ))}
      </div>
    ))}

    <h2>Type specimen</h2>
    <p style={{ fontFamily: typography.fontFamily.body, margin: 0 }}>
      Instrument Sans — The calm center of complex systems.
    </p>
    <p style={{ fontFamily: typography.fontFamily.mono, margin: 0 }}>Geist Mono — 0x2B 0x26 0x20</p>
    <p
      style={{
        fontFamily: typography.fontFamily.display,
        fontSize: 38,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        margin: 0,
      }}
    >
      Fraunces — serendipity
    </p>

    <h2>Elevation</h2>
    <div style={{ display: 'flex', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((level) => (
        <div
          key={level}
          style={{ width: 96, height: 96, background: colors.sand[50], borderRadius: radius.md, boxShadow: elevation[level] }}
        />
      ))}
    </div>
  </div>
)

const meta: Meta<typeof Showcase> = {
  title: 'Brand/Xerena identity',
  component: Showcase,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Showcase>

export const Default: Story = {}