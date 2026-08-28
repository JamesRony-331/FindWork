import test from 'node:test'
import assert from 'node:assert/strict'
import { userNavGroups } from '../src/data/navigation.js'

test('用户导航不包含管理端路由', () => {
  const paths = userNavGroups.flatMap((group) => group.items.map((item) => item.path))
  assert.equal(paths.some((path) => path.startsWith('/admin/')), false)
  assert.equal(paths.includes('/user/jobs'), true)
  assert.equal(paths.includes('/user/ai-chat'), true)
})
