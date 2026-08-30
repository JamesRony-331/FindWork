import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

test('dashboard includes every approved data region', () => {
  const view = source('views/DashboardView.vue')

  for (const label of ['近七日采集趋势', '数据来源', '热门城市', '数据质量', '采集任务', '最近操作']) {
    assert.match(view, new RegExp(label))
  }

  for (const component of ['MetricCard', 'TrendChart', 'SourceDonut', 'HorizontalBars', 'QualityOverview', 'StatusTag']) {
    assert.match(view, new RegExp(`<${component}`))
  }
})

test('admin layout exposes responsive navigation and logout confirmation', () => {
  const layout = source('layouts/AdminLayout.vue')

  assert.match(layout, /collapsed/)
  assert.match(layout, /mobileOpen/)
  assert.match(layout, /GoWorking 管理端/)
  assert.match(layout, /首页/)
  assert.match(layout, /数据更新/)
  assert.match(layout, /<ConfirmDialog/)
  assert.match(layout, /clearDemoSession/)
  assert.doesNotMatch(layout, /window\.(?:alert|confirm)/)
})

test('responsive stylesheet covers desktop collapse, mobile drawer, and narrow metrics', () => {
  const css = source('styles/responsive.css')

  assert.match(css, /@media\s*\(max-width:\s*1100px\)/)
  assert.match(css, /@media\s*\(max-width:\s*720px\)/)
  assert.match(css, /@media\s*\(max-width:\s*480px\)/)
  assert.match(css, /overflow-x:\s*auto/)
})
