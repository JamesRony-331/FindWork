import test from 'node:test';
import assert from 'node:assert/strict';
import { reactive, watchEffect } from 'vue';
import { createJobsState } from '../src/data/user/jobs.js';

test('岗位查询按关键词过滤并重置到第一页', () => {
  const state = createJobsState();
  state.filters.keyword = 'Java';
  state.search();
  assert.equal(
    state.visibleRows.every((row) => row.jobName.includes('Java')),
    true,
  );
  assert.equal(state.pagination.page, 1);
});

test('岗位查询经过 Vue reactive 包装后仍更新可见行', () => {
  const state = reactive(createJobsState());
  let renders = 0;
  const stop = watchEffect(
    () => {
      state.visibleRows.length;
      renders += 1;
    },
    { flush: 'sync' },
  );
  state.filters.keyword = 'Java';
  state.search();
  assert.deepEqual(
    state.visibleRows.map((row) => row.jobName),
    ['Java 开发工程师', 'Java 后端开发'],
  );
  assert.equal(renders > 1, true);
  stop();
});
