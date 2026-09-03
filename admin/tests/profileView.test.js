import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('administrator profile loads and displays roles and permissions', () => {
  const view = readFileSync(new URL('../src/views/ProfileView.vue', import.meta.url), 'utf8')

  for (const copy of ['个人主页', '基本信息', '角色信息', '权限信息', '角色名称', '角色编码', '权限名称', '权限编码']) {
    assert.match(view, new RegExp(copy))
  }
  assert.match(view, /getUserRoles/)
  assert.match(view, /getUserPermissions/)
  assert.match(view, /Promise\.all/)
  assert.match(view, /readAuthSession/)
  assert.match(view, /loading/)
  assert.match(view, /loadError/)
  assert.match(view, /groupPermissions/)
  assert.match(view, /权限搜索/)
  assert.match(view, /权限分组/)
  assert.match(view, /togglePermissionGroup/)
  assert.match(view, /permission-search/)
  assert.match(view, /permission-collapse--open/)
  assert.match(view, /grid-template-rows:\s*0fr/)
  assert.match(view, /grid-template-rows:\s*1fr/)
  assert.match(view, /220ms/)
  assert.match(view, /prefers-reduced-motion:\s*reduce/)
})
