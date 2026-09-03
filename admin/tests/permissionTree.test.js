import test from 'node:test'
import assert from 'node:assert/strict'
import { collectPermissionIds, initialSelectedIds, nodeSelectionState, toggleNodeSelection } from '../src/utils/permissionTree.js'

const tree = [{
  key: 'group:system', label: '系统管理', children: [
    { key: 'permission:1', permissionId: 1, checked: true, children: [] },
    { key: 'permission:2', permissionId: 2, checked: false, children: [] },
  ],
}]

test('permission tree derives all and initially selected leaf ids', () => {
  assert.deepEqual(collectPermissionIds(tree), [1, 2])
  assert.deepEqual(initialSelectedIds(tree), [1])
})

test('parent selection links all descendant permissions', () => {
  assert.deepEqual(toggleNodeSelection([1], tree[0]), [1, 2])
  assert.deepEqual(toggleNodeSelection([1, 2], tree[0]), [])
})

test('tree nodes report checked, mixed, and unchecked states', () => {
  assert.equal(nodeSelectionState(tree[0], [1]), 'mixed')
  assert.equal(nodeSelectionState(tree[0], [1, 2]), 'checked')
  assert.equal(nodeSelectionState(tree[0], []), 'unchecked')
})
