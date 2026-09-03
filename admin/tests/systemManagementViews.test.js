import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewCases = [
  ['MenuManagementView.vue', ['菜单管理', '菜单名称', '路由地址', '权限标识']],
  ['RoleManagementView.vue', ['角色管理', '角色名称', '角色编码', '关联权限']],
  ['PermissionManagementView.vue', ['权限管理', '权限名称', '权限编码']],
]

for (const [filename, expectedCopy] of viewCases) {
  test(`${filename} exposes the approved static management surface`, () => {
    const source = readFileSync(new URL(`../src/views/system/${filename}`, import.meta.url), 'utf8')

    for (const copy of expectedCopy) assert.match(source, new RegExp(copy))
    assert.match(source, /ManagementTable/)
    assert.match(source, /新增/)
    if (filename === 'MenuManagementView.vue') {
      assert.match(source, /编辑/)
      assert.match(source, /删除/)
    }
  })
}

test('permission management removes unsupported fields and connects existing RBAC APIs', () => {
  const source = readFileSync(new URL('../src/views/system/PermissionManagementView.vue', import.meta.url), 'utf8')

  assert.doesNotMatch(source, /关联角色|作用范围/)
  assert.match(source, /getUserPermissions/)
  assert.match(source, /insertPermission/)
  assert.match(source, /updatePermission/)
  assert.match(source, /:deletable="false"/)
  assert.match(source, /:save-handler="savePermission"/)
})

test('role management loads real roles and edits permissions through the tree', () => {
  const source = readFileSync(new URL('../src/views/system/RoleManagementView.vue', import.meta.url), 'utf8')

  assert.match(source, /getRoleList/)
  assert.match(source, /insertRole/)
  assert.match(source, /updateRole/)
  assert.match(source, /PermissionTreeEditor/)
  assert.match(source, /#field-permissions/)
  assert.doesNotMatch(source, /当前内容为静态演示数据/)
})

test('shared management table provides search, status filter, pagination, and dialog interactions', () => {
  const source = readFileSync(new URL('../src/components/ManagementTable.vue', import.meta.url), 'utf8')

  assert.match(source, /searchKeyword/)
  assert.match(source, /statusFilter/)
  assert.match(source, /currentPage/)
  assert.match(source, /editorOpen/)
  assert.match(source, /deleteOpen/)
  assert.match(source, /watch\(\(\) => props\.rows/)
  assert.match(source, /props\.saveHandler/)
  assert.match(source, /\$slots\[`field-\$\{field\.key\}`\]/)
  assert.match(source, /:for="`management-field-\$\{field\.key\}`"/)
  assert.match(source, /:id="`management-field-\$\{field\.key\}`"/)
  assert.doesNotMatch(source, /alert\s*\(|confirm\s*\(/)
})
