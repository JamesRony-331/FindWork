import test from 'node:test';
import assert from 'node:assert/strict';
import { createLoginPayload, validateLogin } from '../src/data/common/login.js';
import { createRegisterPayload, validateRegister } from '../src/data/common/register.js';

test('注册校验拒绝不一致密码', () => {
  const errors = validateRegister({
    nickname: 'student01',
    email: 'student@example.com',
    password: 'abc12345',
    confirmPassword: 'abc12346',
  });
  assert.equal(errors.confirmPassword, '两次输入的密码不一致');
});

test('登录校验拒绝错误的邮箱格式', () => {
  const errors = validateLogin({ email: 'student', password: 'abc12345' });
  assert.equal(errors.email, '请输入正确的邮箱地址');
});

test('登录请求只提交后端需要的字段', () => {
  assert.deepEqual(
    createLoginPayload({
      email: ' student@example.com ',
      password: 'abc12345',
      remember: true,
    }),
    { email: 'student@example.com', password: 'abc12345' },
  );
});

test('注册请求只提交昵称邮箱和密码', () => {
  assert.deepEqual(
    createRegisterPayload({
      nickname: 'student01',
      email: ' student@example.com ',
      password: 'abc12345',
      confirmPassword: 'abc12345',
    }),
    { nickname: 'student01', email: 'student@example.com', password: 'abc12345' },
  );
});
