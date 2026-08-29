import { barOption, lineOption } from '../chartPresets.js';
export const pageMeta = {
  title: '数据看板',
  description: '汇总计算机类毕业生招聘市场的核心数据',
  meta: '数据更新时间：2025-05-20 10:00',
};
export const summaryMetrics = [
  { key: 'jobs', label: '岗位总数', value: '128,764', note: '较上期 +8.62%', icon: 'briefcase' },
  {
    key: 'companies',
    label: '企业总数',
    value: '18,932',
    note: '覆盖多类型招聘企业',
    icon: 'layers',
  },
  {
    key: 'averageSalary',
    label: '平均薪资',
    value: '8,962 元',
    note: '按月薪口径统计',
    icon: 'salary',
  },
  {
    key: 'medianSalary',
    label: '中位薪资',
    value: '7,500 元',
    note: '更稳定的薪资参考',
    icon: 'chart',
  },
];
export const topJobs = [
  { name: '软件开发工程师', value: 12842 },
  { name: '销售代表', value: 8763 },
  { name: '产品经理', value: 6591 },
  { name: '测试工程师', value: 5184 },
  { name: '数据分析师', value: 4932 },
  { name: '运维工程师', value: 4126 },
];
export const topCities = [
  { name: '北京', value: 23541, ratio: '18.28%' },
  { name: '上海', value: 19872, ratio: '15.43%' },
  { name: '深圳', value: 15642, ratio: '12.14%' },
  { name: '杭州', value: 8721, ratio: '6.77%' },
  { name: '广州', value: 7985, ratio: '6.20%' },
];
export const trendOption = {
  ...lineOption(
    ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
    [78314, 85621, 92486, 101843, 111657, 120089, 128764],
  ),
  animationDuration: 1800,
  animationEasing: 'cubicOut',
  animationDelay: (index) => index * 80,
};
export const jobsOption = {
  ...barOption(
    topJobs.map((i) => i.name),
    topJobs.map((i) => i.value),
    '岗位数',
    true,
  ),
  animationDuration: 1400,
  animationEasing: 'cubicOut',
  animationDelay: (index) => index * 60,
};
export function handlePeriodChange(period) {
  return period === 'week' ? 'week' : 'month';
}
