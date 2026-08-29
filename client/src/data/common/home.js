export const capabilities = [
  {
    icon: 'search',
    title: '查询岗位信息',
    description: '按城市、岗位、学历、薪资和专业方向快速筛选招聘信息',
    path: '/user/jobs',
  },
  {
    icon: 'chart',
    title: '洞察就业趋势',
    description: '查看岗位需求、薪资水平与城市就业机会的变化',
    path: '/user/dashboard',
  },
  {
    icon: 'education',
    title: '辅助就业判断',
    description: '结合学历层次和专业方向，了解更匹配的就业选择',
    path: '/user/analysis/education',
  },
];
export const homeMetrics = [
  { icon: 'briefcase', label: '招聘岗位', value: '12,680', note: '覆盖计算机类岗位' },
  { icon: 'salary', label: '平均月薪', value: '13.6K', note: '样本岗位综合均值' },
  { icon: 'location', label: '覆盖城市', value: '36', note: '重点就业城市' },
  { icon: 'chart', label: '数据记录', value: '28,590', note: '清洗后的有效记录' },
];
export const homeFacts = [
  { label: '数据范围', value: '计算机类招聘岗位' },
  { label: '分析维度', value: '岗位 · 薪资 · 城市 · 学历' },
];
export const homePreviewMeta = {
  title: '就业数据概览',
  updatedAt: '数据更新至 2026 年 8 月',
  status: '数据正常',
};
export const homeTrend = [
  { month: '3月', value: 36 },
  { month: '4月', value: 48 },
  { month: '5月', value: 44 },
  { month: '6月', value: 63 },
  { month: '7月', value: 58 },
  { month: '8月', value: 82 },
];
export const homeCities = [
  { name: '北京', value: 2860, percent: 100 },
  { name: '上海', value: 2410, percent: 84 },
  { name: '深圳', value: 2180, percent: 76 },
  { name: '杭州', value: 1720, percent: 60 },
];
export const homeFeatureLinks = [
  {
    icon: 'search',
    title: '岗位数据查询',
    description: '按岗位、城市、学历和薪资快速筛选招聘信息',
    path: '/user/jobs',
  },
  {
    icon: 'salary',
    title: '薪资水平分析',
    description: '对比岗位类别、经验与学历对应的薪资差异',
    path: '/user/analysis/salary',
  },
  {
    icon: 'location',
    title: '城市就业分析',
    description: '发现重点城市的岗位数量与就业机会分布',
    path: '/user/analysis/city',
  },
  {
    icon: 'chat',
    title: 'AI 就业助手',
    description: '结合演示数据获取求职方向与能力提升建议',
    path: '/user/ai-chat',
  },
];
export function getHomeActions() {
  return [
    { label: '查看系统展示', path: '/showcase', primary: true, featured: true },
    { label: '进入数据看板', path: '/user/dashboard', primary: false },
    { label: '查询招聘岗位', path: '/user/jobs', primary: false },
  ];
}
