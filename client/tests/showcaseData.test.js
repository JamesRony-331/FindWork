import test from 'node:test';
import assert from 'node:assert/strict';
import { getHomeActions } from '../src/data/common/home.js';
import { showcaseSections, showcaseTicker, showcaseProofs } from '../src/data/common/showcase.js';

test('主页提供进入系统展示页的按钮', () => {
  const [featuredAction] = getHomeActions();
  assert.deepEqual(featuredAction, {
    label: '查看系统展示',
    path: '/showcase',
    primary: true,
    featured: true,
  });
});

test('系统展示页由结构化数据提供四个主题分区', () => {
  assert.deepEqual(
    showcaseSections.map((item) => item.key),
    ['demand', 'salary', 'city', 'ai'],
  );
  assert.ok(showcaseSections.every((item) => item.metrics.length >= 3));
  assert.ok(showcaseTicker.length >= 6);
  assert.equal(showcaseProofs.length, 4);
});
