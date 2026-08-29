import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRows, paginateRows, resetObject } from '../src/utils/pageData.js';

test('filterRows 在指定字段中进行不区分大小写的包含匹配', () => {
  const rows = [
    { job: 'Java 开发', city: '杭州' },
    { job: '测试工程师', city: '上海' },
  ];
  assert.deepEqual(filterRows(rows, 'java', ['job']), [rows[0]]);
});

test('paginateRows 返回当前页和总页数', () => {
  const result = paginateRows([1, 2, 3, 4, 5], 2, 2);
  assert.deepEqual(result, { rows: [3, 4], total: 5, page: 2, pageCount: 3 });
});

test('resetObject 用默认值覆盖目标对象', () => {
  const target = { city: '杭州', keyword: 'Java' };
  resetObject(target, { city: '', keyword: '' });
  assert.deepEqual(target, { city: '', keyword: '' });
});
