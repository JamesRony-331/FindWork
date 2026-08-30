import test from 'node:test'
import assert from 'node:assert/strict'
import { metrics, collectionTrend, collectionTasks } from '../src/data/dashboard.js'
import { toPercent, toPolylinePoints } from '../src/utils/dashboard.js'

test('dashboard demonstration datasets have stable identifiers', () => {
  assert.equal(metrics.length, 4)
  assert.equal(collectionTrend.length, 7)
  assert.ok(metrics.every((item) => item.id && item.label && Number.isFinite(item.value)))
  assert.ok(collectionTasks.every((item) => item.id && item.status))
})

test('chart helpers clamp percentages and create SVG points', () => {
  assert.equal(toPercent(25, 100), 25)
  assert.equal(toPercent(120, 100), 100)
  assert.match(toPolylinePoints([10, 20, 15], 300, 120, 12), /^\d+(\.\d+)?,\d+(\.\d+)?/)
})
