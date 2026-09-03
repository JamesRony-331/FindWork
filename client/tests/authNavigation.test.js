import test from 'node:test';
import assert from 'node:assert/strict';
import { getAuthRedirect, isClientAuthenticated } from '../src/utils/authNavigation.js';

test('已登录用户不能再进入登录和注册页', () => {
  assert.equal(getAuthRedirect('/login', true), '/user/dashboard');
  assert.equal(getAuthRedirect('/register', true), '/user/dashboard');
  assert.equal(getAuthRedirect('/', true), null);
});

test('未登录用户访问用户页时返回登录页', () => {
  assert.equal(getAuthRedirect('/user/dashboard', false), '/login');
  assert.equal(getAuthRedirect('/user/jobs/1', false), '/login');
  assert.equal(getAuthRedirect('/profile', false), '/login');
  assert.equal(getAuthRedirect('/showcase', false), null);
});

test('登录态只在 token 存在时成立', () => {
  assert.equal(isClientAuthenticated({ getItem: () => 'jwt-token' }), true);
  assert.equal(isClientAuthenticated({ getItem: () => '' }), false);
  assert.equal(isClientAuthenticated({ getItem: () => null }), false);
});
