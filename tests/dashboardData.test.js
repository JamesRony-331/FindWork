import test from 'node:test'
import assert from 'node:assert/strict'
import { summaryMetrics, topJobs } from '../src/data/user/dashboard.js'

test('看板指标和岗位排行具有稳定标识', () => {
  assert.equal(summaryMetrics.length, 4)
  assert.equal(new Set(summaryMetrics.map((item) => item.key)).size, 4)
  assert.equal(topJobs.every((item) => item.name && Number.isFinite(item.value)), true)
})
