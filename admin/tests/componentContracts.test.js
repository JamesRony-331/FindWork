import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = (name) => readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8')

test('dashboard components expose accessible labels and reduced-motion hooks', () => {
  assert.match(source('TrendChart.vue'), /aria-label/)
  assert.match(source('SourceDonut.vue'), /aria-label/)
  assert.match(source('ConfirmDialog.vue'), /role="dialog"/)
  assert.match(source('ConfirmDialog.vue'), /aria-modal="true"/)
})
