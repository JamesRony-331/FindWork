import test from 'node:test';
import assert from 'node:assert/strict';
import routes from '../src/router/router.js';

test('路由表不引用已移除的管理端页面', () => {
  const adminRoutes = routes.filter((route) => route.path.startsWith('/admin'));
  assert.deepEqual(adminRoutes, []);
});
