import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

test('admin API calls the implemented backend endpoints', () => {
  const api = source('api/admin.js')

  assert.match(api, /\/user\/AdminLogin/)
  assert.match(api, /\/rbac\/getUserRole/)
  assert.match(api, /\/rbac\/getRoleList/)
  assert.match(api, /\/rbac\/getPermissionTree/)
  assert.match(api, /\/rbac\/insertRole/)
  assert.match(api, /\/rbac\/updateRole/)
  assert.match(api, /\/rbac\/getUserPermission/)
  assert.match(api, /\/rbac\/insertPermission/)
  assert.match(api, /\/rbac\/updatePermission/)
  assert.match(api, /\/menu\/getMenu/)
  assert.match(api, /\/user\/getUserList/)
})

test('admin request sends the raw JWT in Authorization', () => {
  const request = source('request/Request.js')

  assert.match(request, /config\.headers\.Authorization\s*=\s*token/)
  assert.doesNotMatch(request, /JSON\.stringify\(token\)/)
})

test('admin dev proxy keeps port 5050 as default and supports an isolated test backend', () => {
  const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8')

  assert.match(viteConfig, /process\.env\.VITE_ADMIN_API_TARGET/)
  assert.match(viteConfig, /http:\/\/localhost:5050/)
})
