import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAdminNavigation } from '../src/utils/menuNavigation.js'

test('backend menu rows become an ordered navigation tree', () => {
  const navigation = buildAdminNavigation([
    { menuId: 12, parentId: 10, menuName: '角色管理', path: '/system/role', icon: 'roles', sortOrder: 2 },
    { menuId: 2, parentId: 0, menuName: '个人主页', path: '/profile', icon: 'user', sortOrder: 2 },
    { menuId: 10, parentId: 0, menuName: '系统管理', path: '/system', icon: 'settings', sortOrder: 3 },
    { menuId: 1, parentId: 0, menuName: '数据大屏', path: '/dashboard', icon: 'dashboard', sortOrder: 1 },
    { menuId: 11, parentId: 10, menuName: '菜单管理', path: '/system/menu', icon: 'menu-tree', sortOrder: 1 },
  ])

  assert.deepEqual(navigation, [
    { id: '1', label: '数据大屏', icon: 'dashboard', to: '/dashboard', children: [] },
    { id: '2', label: '个人主页', icon: 'user', to: '/profile', children: [] },
    {
      id: '10', label: '系统管理', icon: 'settings', to: '/system', children: [
        { id: '11', label: '菜单管理', icon: 'menu-tree', to: '/system/menu', children: [] },
        { id: '12', label: '角色管理', icon: 'roles', to: '/system/role', children: [] },
      ],
    },
  ])
})

test('orphaned and malformed menu rows are omitted safely', () => {
  assert.deepEqual(buildAdminNavigation([
    { menuId: 1, parentId: 99, menuName: '孤立菜单', path: '/orphan' },
    { menuId: 2, parentId: 0, menuName: '', path: '/invalid' },
    null,
  ]), [])
})
