import test from 'node:test';
import assert from 'node:assert/strict';
import * as salary from '../src/data/user/salary.js';

test('薪资分析包含文档要求的五类可视化', () => {
  const titles = salary.charts.map((chart) => chart.title);
  for (const title of [
    '岗位平均薪资',
    '薪资区间分布',
    '城市平均薪资排行',
    '不同学历平均薪资',
    '高薪岗位 Top10',
  ]) {
    assert.equal(titles.includes(title), true);
  }
});
