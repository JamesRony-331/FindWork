import test from 'node:test'
import assert from 'node:assert/strict'
import { getHomeActions, homeFacts, homeMetrics, homeFeatureLinks, homePreviewMeta } from '../src/data/common/home.js'

test('主页保留直接进入普通用户数据看板的操作', () => {
  const dashboardAction = getHomeActions().find((item) => item.path === '/user/dashboard')
  assert.equal(dashboardAction.label, '进入数据看板')
})

test('主页看板预览和功能入口由结构化变量提供', () => {
  assert.equal(homeMetrics.length, 4)
  assert.ok(homeMetrics.every((item) => item.label && item.value && item.icon))
  assert.ok(homeFeatureLinks.some((item) => item.path === '/user/ai-chat'))
  assert.equal(homeFacts.length, 2)
  assert.match(homePreviewMeta.updatedAt, /^数据更新至/)
})
