import test from 'node:test';
import assert from 'node:assert/strict';
import { publicNavItems, topbarNavItems, userNavGroups } from '../src/data/navigation.js';
import { readFileSync } from 'node:fs';

test('用户导航不包含管理端路由', () => {
  const paths = userNavGroups.flatMap((group) => group.items.map((item) => item.path));
  assert.equal(
    paths.some((path) => path.startsWith('/admin/')),
    false,
  );
  assert.equal(paths.includes('/user/jobs'), true);
  assert.equal(paths.includes('/user/ai-chat'), true);
});

test('顶部导航包含首页和系统展示入口', () => {
  assert.deepEqual(topbarNavItems, [
    { label: '首页', path: '/' },
    { label: '系统展示', path: '/showcase' },
    { label: '数据看板', path: '/user/dashboard' },
    { label: '岗位查询', path: '/user/jobs' },
  ]);
});

test('公共导航与用户顶部导航顺序一致', () => {
  assert.deepEqual(publicNavItems, topbarNavItems);
});

test('公共页面根据登录态显示登录或个人中心入口', () => {
  const layout = readFileSync(new URL('../src/layouts/PublicLayout.vue', import.meta.url), 'utf8');

  assert.match(layout, /isClientAuthenticated/);
  assert.match(layout, /v-if="authenticated"[\s\S]*to="\/profile"[\s\S]*个人中心/);
  assert.match(layout, /v-else[\s\S]*to="\/login"[\s\S]*登录/);
});
