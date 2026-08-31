import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewCases = [
  ['MenuManagementView.vue', ['菜单管理', '菜单名称', '路由地址', '权限标识']],
  ['RoleManagementView.vue', ['角色管理', '角色名称', '角色编码', '关联权限']],
  ['PermissionManagementView.vue', ['权限管理', '权限名称', '权限编码', '关联角色']],
]

for (const [filename, expectedCopy] of viewCases) {
  test(`${filename} exposes the approved static management surface`, () => {
    const source = readFileSync(new URL(`../src/views/system/${filename}`, import.meta.url), 'utf8')

    for (const copy of expectedCopy) assert.match(source, new RegExp(copy))
    assert.match(source, /ManagementTable/)
    assert.match(source, /新增/)
    assert.match(source, /编辑/)
    assert.match(source, /删除/)
  })
}

test('shared management table provides search, status filter, pagination, and dialog interactions', () => {
  const source = readFileSync(new URL('../src/components/ManagementTable.vue', import.meta.url), 'utf8')

  assert.match(source, /searchKeyword/)
  assert.match(source, /statusFilter/)
  assert.match(source, /currentPage/)
  assert.match(source, /editorOpen/)
  assert.match(source, /deleteOpen/)
  assert.doesNotMatch(source, /alert\s*\(|confirm\s*\(/)
})
