import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('login view exposes the approved form controls and inline feedback', () => {
  const view = readFileSync(new URL('../src/views/LoginView.vue', import.meta.url), 'utf8')

  for (const label of ['管理员账号', '密码', '记住登录状态', '登录管理端']) {
    assert.match(view, new RegExp(label))
  }

  assert.match(view, /aria-live="polite"/)
  assert.match(view, /adminLogin/)
  assert.match(view, /createAuthSession/)
  assert.match(view, /isSubmitting/)
  assert.match(view, /loginError/)
  assert.match(view, /router\.replace\('\/dashboard'\)/)
  assert.match(view, /const remember = ref\(false\)/)
  assert.doesNotMatch(view, /任意非空账号和密码均可登录/)
})
