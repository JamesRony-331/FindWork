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

test('admin design tokens expose the approved palette and radii', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
  assert.match(css, /--color-primary:\s*#087f7a/i)
  assert.match(css, /--color-nav:\s*#093b4b/i)
  assert.match(css, /--radius-control:\s*6px/)
  assert.match(css, /--radius-panel:\s*10px/)
})

test('shared styles use only colors from the approved palette', () => {
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
  const styles = ['tokens.css', 'base.css', 'components.css']

  for (const file of styles) {
    const css = readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8')
    const colors = css.match(/#[0-9a-f]{6}\b/gi) ?? []

    for (const color of colors) {
      assert.ok(approvedPalette.has(color.toLowerCase()), `${file} uses unapproved color ${color}`)
    }
  }
})

test('admin shell provides an installable web-history router', () => {
  assert.equal(typeof router.install, 'function')
  assert.equal(router.getRoutes().length, 0)
})
