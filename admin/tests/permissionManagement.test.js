import test from 'node:test'
import assert from 'node:assert/strict'
import { toPermissionPayload, toPermissionRows } from '../src/utils/permissionManagement.js'

test('backend permissions become management table rows', () => {
  assert.deepEqual(toPermissionRows([
    { id: 7, permissionName: '新增权限', permissionCode: 'system:permission:add' },
  ]), [
    { id: 7, name: '新增权限', code: 'system:permission:add' },
  ])
  assert.deepEqual(toPermissionRows(null), [])
})

test('permission editor records become backend create and update DTOs', () => {
  assert.deepEqual(toPermissionPayload({ name: ' 新增权限 ', code: ' system:permission:add ' }), {
    permissionName: '新增权限',
    permissionCode: 'system:permission:add',
  })
  assert.deepEqual(toPermissionPayload({ id: 7, name: '修改权限', code: 'system:permission:update' }), {
    id: 7,
    permissionName: '修改权限',
    permissionCode: 'system:permission:update',
  })
})
