import test from 'node:test'
import assert from 'node:assert/strict'
import { validateRegister } from '../src/data/common/register.js'

test('注册校验拒绝不一致密码', () => {
  const errors = validateRegister({ username: 'student01', password: 'abc12345', confirmPassword: 'abc12346', contact: '13800138000' })
  assert.equal(errors.confirmPassword, '两次输入的密码不一致')
})
