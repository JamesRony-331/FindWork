import test from 'node:test'
import assert from 'node:assert/strict'
import { groupPermissions } from '../src/utils/permissionGroups.js'

test('permissions are grouped by business module in a stable order', () => {
  const groups = groupPermissions([
    { id: 4, permissionName: '修改角色', permissionCode: 'system:role:update' },
    { id: 2, permissionName: '菜单查询', permissionCode: 'system:menu:list' },
    { id: 1, permissionName: '超级管理员', permissionCode: '*:*:*' },
    { id: 3, permissionName: '后台登录', permissionCode: 'admin:login' },
    { id: 5, permissionName: '用户绑定角色', permissionCode: 'system:user:role:bind' },
  ])

  assert.deepEqual(groups.map(({ id, label, permissions }) => ({ id, label, count: permissions.length })), [
    { id: 'super', label: '核心权限', count: 1 },
    { id: 'menu', label: '菜单管理', count: 1 },
    { id: 'role', label: '角色管理', count: 1 },
    { id: 'user-role', label: '用户角色', count: 1 },
    { id: 'access', label: '访问权限', count: 1 },
  ])
})

test('permission grouping filters names and codes case-insensitively', () => {
  const permissions = [
    { id: 1, permissionName: '新增菜单', permissionCode: 'system:menu:add' },
    { id: 2, permissionName: '修改角色', permissionCode: 'system:role:update' },
  ]

  assert.deepEqual(groupPermissions(permissions, 'MENU').flatMap((group) => group.permissions).map((item) => item.id), [1])
  assert.deepEqual(groupPermissions(permissions, '修改').flatMap((group) => group.permissions).map((item) => item.id), [2])
})
