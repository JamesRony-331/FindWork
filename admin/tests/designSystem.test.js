import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const location = {
  protocol: 'http:',
  host: 'localhost',
  pathname: '/',
  search: '',
  hash: '',
  assign() {},
  replace() {},
}
const history = {
  length: 1,
  state: null,
  pushState(state) {
    this.state = state
  },
  replaceState(state) {
    this.state = state
  },
  go() {},
}

globalThis.window = {
  history,
  location,
  addEventListener() {},
  removeEventListener() {},
}
globalThis.location = location

const { default: router } = await import('../src/router/index.js')

const approvedPalette = new Set([
  '#087f7a',
  '#093b4b',
  '#f3f7f8',
  '#ffffff',
  '#16323d',
  '#647b84',
  '#91a3aa',
  '#dce6e9',
  '#138a63',
  '#d98b22',
  '#c94c4c',
  '#397a9f',
])
const cssHexPattern = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![0-9a-f])/gi

function extractCssHexLiterals(css) {
  return css.match(cssHexPattern) ?? []
}

function normalizeHexColor(color) {
  const value = color.slice(1).toLowerCase()
  const expanded = value.length === 3 || value.length === 4
    ? [...value].map((digit) => digit.repeat(2)).join('')
    : value
  const rgb = expanded.slice(0, 6)
  const alpha = expanded.slice(6)

  return alpha === '' || alpha === 'ff' ? `#${rgb}` : `#${expanded}`
}

function assertApprovedPalette(css) {
  for (const color of extractCssHexLiterals(css)) {
    const normalized = normalizeHexColor(color)
    assert.ok(approvedPalette.has(normalized), `uses unapproved color ${color}`)
  }
}

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255)
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function contrastRatio(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

test('admin design tokens expose the approved palette and radii', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
  assert.match(css, /--color-primary:\s*#087f7a/i)
  assert.match(css, /--color-nav:\s*#093b4b/i)
  assert.match(css, /--radius-control:\s*6px/)
  assert.match(css, /--radius-panel:\s*10px/)
})

test('shared styles use only colors from the approved palette', () => {
  const styles = ['tokens.css', 'base.css', 'components.css']

  for (const file of styles) {
    const css = readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8')
    assert.doesNotThrow(() => assertApprovedPalette(css), file)
  }
})

test('palette scanner rejects unapproved shorthand and alpha hex literals', () => {
  for (const color of ['#fff', '#ffff', '#ffffffff']) {
    assert.doesNotThrow(() => assertApprovedPalette(`.fixture { color: ${color}; }`))
  }

  for (const color of ['#123', '#1234', '#12345678', '#fff0']) {
    assert.throws(() => assertApprovedPalette(`.fixture { color: ${color}; }`), /unapproved color/)
  }
})

test('normal-size semantic and weak labels use an approved 4.5:1 text color', () => {
  assert.ok(contrastRatio('16323d', 'ffffff') >= 4.5)
  assert.ok(contrastRatio('16323d', 'f3f7f8') >= 4.5)

  const components = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8')
  const dashboard = readFileSync(new URL('../src/views/DashboardView.vue', import.meta.url), 'utf8')
  const metric = readFileSync(new URL('../src/components/MetricCard.vue', import.meta.url), 'utf8')

  assert.match(components, /\.status\s*\{[\s\S]*?color:\s*var\(--color-text\)/)
  assert.match(components, /--status-indicator:\s*var\(--color-(?:success|warning|danger|info)\)/)
  assert.match(dashboard, /\.dashboard-metric__demo\s*\{[\s\S]*?color:\s*var\(--color-text\)/)
  assert.match(dashboard, /\.dashboard-heading__demo\s*\{[\s\S]*?color:\s*var\(--color-text\)/)
  assert.match(metric, /\.metric-card__change\s*\{[\s\S]*?color:\s*var\(--color-text\)/)
})

test('admin shell provides an installable web-history router', () => {
  assert.equal(typeof router.install, 'function')
  assert.equal(router.getRoutes().length, 7)
})
