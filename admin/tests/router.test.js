import test from 'node:test'
import assert from 'node:assert/strict'
import router, { routes } from '../src/router/index.js'
import { clearDemoSession, createDemoSession } from '../src/utils/demoSession.js'

test('admin routes expose login and dashboard only', () => {
  assert.ok(routes.some((route) => route.path === '/login'))
  const protectedLayout = routes.find((route) => route.meta?.requiresAuth)
  assert.ok(protectedLayout?.children?.some((route) => route.path === '/dashboard'))
  assert.equal(routes.filter((route) => route.meta?.requiresAuth).length, 1)
})

test('admin home redirects according to the demo session', async () => {
  clearDemoSession()
  await router.push('/')
  assert.equal(router.currentRoute.value.name, 'AdminLogin')

  createDemoSession('admin', true)
  await router.push('/')
  assert.equal(router.currentRoute.value.name, 'AdminDashboard')
  clearDemoSession()
})

test('admin route guards keep unauthenticated users on login', async () => {
  clearDemoSession()
  await router.push('/')
  await router.push('/dashboard')
  assert.equal(router.currentRoute.value.name, 'AdminLogin')
})

test('admin route guards send authenticated users to the dashboard', async () => {
  createDemoSession('admin', true)
  await router.push('/dashboard')
  await router.push('/login')
  assert.equal(router.currentRoute.value.name, 'AdminDashboard')
  clearDemoSession()
})
