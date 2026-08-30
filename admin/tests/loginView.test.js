import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('login view exposes the approved form controls and inline feedback', () => {
  const view = readFileSync(new URL('../src/views/LoginView.vue', import.meta.url), 'utf8')

  for (const label of ['管理员账号', '密码', '记住登录状态', '登录管理端']) {
    assert.match(view, new RegExp(label))
  }

  assert.match(view, /aria-live="polite"/)
  assert.match(view, /createDemoSession/)
  assert.match(view, /router\.replace\('\/dashboard'\)/)
})
