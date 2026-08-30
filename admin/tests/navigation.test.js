import test from 'node:test'
import assert from 'node:assert/strict'
import { adminNavigation } from '../src/data/navigation.js'

test('admin navigation follows the approved order', () => {
  assert.deepEqual(adminNavigation.map((item) => item.label), [
    '数据大屏', '用户管理', '岗位数据', '采集管理', '数据清洗', '字典管理', '系统日志',
  ])
})

test('only the dashboard navigation item is enabled', () => {
  const enabledItems = adminNavigation.filter((item) => !item.disabled)

  assert.deepEqual(enabledItems.map((item) => item.to), ['/dashboard'])
  assert.ok(adminNavigation.filter((item) => item.disabled).every((item) => item.badge === '待建设'))
})
