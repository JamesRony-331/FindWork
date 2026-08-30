import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('admin design tokens expose the approved palette and radii', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
  assert.match(css, /--color-primary:\s*#087f7a/i)
  assert.match(css, /--color-nav:\s*#093b4b/i)
  assert.match(css, /--radius-control:\s*6px/)
  assert.match(css, /--radius-panel:\s*10px/)
})
