import test from 'node:test'
import assert from 'node:assert/strict'
import { adminNavigation } from '../src/data/navigation.js'

test('admin navigation follows the approved order', () => {
  assert.deepEqual(adminNavigation.map((item) => item.label), [
    '数据大屏', '用户管理', '岗位数据', '采集管理', '数据清洗', '字典管理', '系统管理', '系统日志',
  ])
})

test('system management exposes menu, role, and permission child routes', () => {
  const system = adminNavigation.find((item) => item.id === 'system')

  assert.equal(system.disabled, false)
  assert.deepEqual(system.children.map(({ label, to }) => ({ label, to })), [
    { label: '菜单管理', to: '/system/menu' },
    { label: '角色管理', to: '/system/role' },
    { label: '权限管理', to: '/system/permission' },
  ])
})

test('unfinished top-level items remain disabled', () => {
  const unfinished = adminNavigation.filter((item) => item.disabled)

  assert.ok(unfinished.every((item) => item.badge === '待建设'))
})
