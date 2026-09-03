import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDynamicRouteRecords } from '../src/router/dynamicRoutes.js'

const components = {
  DashboardView: () => Promise.resolve({ default: {} }),
  UserManagementView: () => Promise.resolve({ default: {} }),
}

test('component menus become protected route records from backend fields', () => {
  const records = buildDynamicRouteRecords([
    {
      menuId: 1,
      parentId: 0,
      menuName: '数据大屏',
      menuType: 'C',
      path: '/dashboard',
      component: 'DashboardView',
      routeName: 'AdminDashboard',
      icon: 'dashboard',
    },
  ], components)

  assert.equal(records.length, 1)
  assert.equal(records[0].path, '/dashboard')
  assert.equal(records[0].name, 'AdminDashboard')
  assert.equal(records[0].component, components.DashboardView)
  assert.deepEqual(records[0].meta, {
    requiresAuth: true,
    title: '数据大屏',
    icon: 'dashboard',
    menuId: 1,
  })
})

test('directory menus and unknown components are not registered as page routes', () => {
  const records = buildDynamicRouteRecords([
    { menuId: 10, menuName: '系统管理', menuType: 'M', path: '/system', component: 'Layout', routeName: 'SystemManagement' },
    { menuId: 11, menuName: '未知页面', menuType: 'C', path: '/unknown', component: 'MissingView', routeName: 'MissingView' },
  ], components)

  assert.deepEqual(records, [])
})

test('child routes inherit the parent directory title for breadcrumbs', () => {
  const records = buildDynamicRouteRecords([
    { menuId: 10, parentId: 0, menuName: '系统管理', menuType: 'M', path: '/system', component: 'Layout', routeName: 'SystemManagement' },
    { menuId: 11, parentId: 10, menuName: '用户管理', menuType: 'C', path: '/users', component: 'UserManagementView', routeName: 'UserManagement' },
  ], components)

  assert.equal(records[0].meta.section, '系统管理')
})

test('duplicate, malformed, and unsafe menu routes are omitted', () => {
  const records = buildDynamicRouteRecords([
    { menuId: 1, menuName: '用户管理', menuType: 'C', path: '/users', component: 'UserManagementView', routeName: 'UserManagement' },
    { menuId: 2, menuName: '重复路由', menuType: 'C', path: '/users', component: 'UserManagementView', routeName: 'DuplicateUsers' },
    { menuId: 3, menuName: '外部地址', menuType: 'C', path: 'https://example.com', component: 'UserManagementView', routeName: 'ExternalUsers' },
    { menuId: 4, menuName: '缺少名称', menuType: 'C', path: '/missing-name', component: 'UserManagementView' },
  ], components)

  assert.deepEqual(records.map(({ path, name }) => ({ path, name })), [
    { path: '/users', name: 'UserManagement' },
  ])
})
