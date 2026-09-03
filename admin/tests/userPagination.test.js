import assert from 'node:assert/strict'
import test from 'node:test'

import { formatUserSex, normalizeUserPage } from '../src/utils/userPagination.js'

test('normalizes SelectByPageVO into rows and server pagination metadata', () => {
  const page = normalizeUserPage({
    pageNum: 2,
    pageSize: 10,
    total: 3,
    totalCount: 21,
    VOList: [{ uuid: 'user-1', nickname: '测试用户', sex: 1, isDelete: 0 }],
  })

  assert.equal(page.pageNum, 2)
  assert.equal(page.pageSize, 10)
  assert.equal(page.totalPages, 3)
  assert.equal(page.totalCount, 21)
  assert.deepEqual(page.rows, [{ uuid: 'user-1', nickname: '测试用户', sex: 1, isDelete: 0 }])
})

test('returns safe pagination defaults for a missing response', () => {
  assert.deepEqual(normalizeUserPage(), {
    pageNum: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    rows: [],
  })
})

test('accepts the lowercase volist emitted by Jackson for getVOList', () => {
  const page = normalizeUserPage({ pageNum: 1, pageSize: 10, total: 1, totalCount: 1, volist: [{ uuid: 'user-2' }] })

  assert.deepEqual(page.rows, [{ uuid: 'user-2' }])
})

test('displays unknown when user sex is missing', () => {
  assert.equal(formatUserSex(null), '未知')
  assert.equal(formatUserSex(undefined), '未知')
  assert.equal(formatUserSex(''), '未知')
  assert.equal(formatUserSex(0), '女')
  assert.equal(formatUserSex(1), '男')
})
