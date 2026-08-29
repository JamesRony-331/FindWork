import test from 'node:test';
import assert from 'node:assert/strict';
import { jobsOption, summaryMetrics, topJobs, trendOption } from '../src/data/user/dashboard.js';

test('看板指标和岗位排行具有稳定标识', () => {
  assert.equal(summaryMetrics.length, 4);
  assert.equal(new Set(summaryMetrics.map((item) => item.key)).size, 4);
  assert.equal(
    topJobs.every((item) => item.name && Number.isFinite(item.value)),
    true,
  );
});

test('看板折线图使用从左到右的错峰入场动画', () => {
  assert.equal(trendOption.animationDuration, 1800);
  assert.equal(trendOption.animationEasing, 'cubicOut');
  assert.equal(trendOption.animationDelay(3), 240);
});

test('看板柱状图使用逐条展开动画', () => {
  assert.equal(jobsOption.animationDuration, 1400);
  assert.equal(jobsOption.animationEasing, 'cubicOut');
  assert.equal(jobsOption.animationDelay(3), 180);
});
