import test from 'node:test'
import assert from 'node:assert/strict'
import { createAdminRouter, staticRoutes } from '../src/router/index.js'
import { clearAuthSession, createAuthSession } from '../src/utils/authSession.js'

const loginData = { nickname: 'admin', email: 'admin', token: 'test-token' }
const backendMenus = [
  { menuId: 1, parentId: 0, menuName: '数据大屏', menuType: 'C', path: '/dashboard', component: 'DashboardView', routeName: 'AdminDashboard' },
  { menuId: 2, parentId: 0, menuName: '个人主页', menuType: 'C', path: '/profile', component: 'ProfileView', routeName: 'AdminProfile' },
]

test('only login and the protected layout remain static', () => {
  assert.ok(staticRoutes.some((route) => route.path === '/login'))
  const protectedLayout = staticRoutes.find((route) => route.name === 'AdminLayout')
  assert.deepEqual(protectedLayout?.children?.map((route) => route.name), ['DynamicRouteBootstrap'])
})

test('authenticated navigation registers routes returned by the menu API', async () => {
  createAuthSession(loginData, true)
  let calls = 0
  const router = createAdminRouter({
    loadMenus: async () => {
      calls += 1
      return backendMenus
    },
  })

  await router.push('/dashboard')

  assert.equal(router.currentRoute.value.name, 'AdminDashboard')
  assert.ok(router.hasRoute('AdminProfile'))
  assert.equal(calls, 1)

  await router.push('/profile')
  assert.equal(calls, 1)
  clearAuthSession()
})

test('unauthenticated users stay on the static login route without loading menus', async () => {
  clearAuthSession()
  let calls = 0
  const router = createAdminRouter({ loadMenus: async () => { calls += 1; return backendMenus } })

  await router.push('/dashboard')

  assert.equal(router.currentRoute.value.name, 'AdminLogin')
  assert.equal(calls, 0)
})

test('authenticated users visiting login are redirected after dynamic routes load', async () => {
  createAuthSession(loginData, true)
  const router = createAdminRouter({ loadMenus: async () => backendMenus })

  await router.push('/login')

  assert.equal(router.currentRoute.value.name, 'AdminDashboard')
  clearAuthSession()
})

test('unknown addresses fall back to the first accessible dynamic page', async () => {
  createAuthSession(loginData, true)
  const router = createAdminRouter({ loadMenus: async () => backendMenus })

  await router.push('/not-authorized')

  assert.equal(router.currentRoute.value.name, 'AdminDashboard')
  clearAuthSession()
})

test('logging out removes old dynamic routes before another account loads menus', async () => {
  let activeMenus = backendMenus.slice(0, 1)
  let calls = 0
  const router = createAdminRouter({
    loadMenus: async () => {
      calls += 1
      return activeMenus
    },
  })

  createAuthSession({ ...loginData, token: 'first-token' }, true)
  await router.push('/dashboard')
  assert.ok(router.hasRoute('AdminDashboard'))

  clearAuthSession()
  await router.push('/login')
  assert.equal(router.hasRoute('AdminDashboard'), false)

  activeMenus = backendMenus.slice(1)
  createAuthSession({ ...loginData, token: 'second-token' }, true)
  await router.push('/profile')

  assert.equal(router.currentRoute.value.name, 'AdminProfile')
  assert.equal(router.hasRoute('AdminDashboard'), false)
  assert.equal(calls, 2)
  clearAuthSession()
})
