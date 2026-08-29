export const topbarNavItems = [
  { label: '首页', path: '/' },
  { label: '系统展示', path: '/showcase' },
  { label: '数据看板', path: '/user/dashboard' },
  { label: '岗位查询', path: '/user/jobs' },
];

export const publicNavItems = topbarNavItems;

export const userNavGroups = [
  {
    label: '数据概览',
    items: [
      { label: '数据看板', path: '/user/dashboard', icon: 'dashboard' },
      { label: '图表总览', path: '/user/dashboard/charts', icon: 'chart' },
    ],
  },
  { label: '岗位服务', items: [{ label: '岗位查询', path: '/user/jobs', icon: 'search' }] },
  {
    label: '就业分析',
    items: [
      { label: '岗位需求', path: '/user/analysis/job-demand', icon: 'briefcase' },
      { label: '薪资水平', path: '/user/analysis/salary', icon: 'salary' },
      { label: '城市区域', path: '/user/analysis/city', icon: 'location' },
      { label: '学历层次', path: '/user/analysis/education', icon: 'education' },
      { label: '专业方向', path: '/user/analysis/major', icon: 'layers' },
      { label: '多维分析', path: '/user/analysis/multi', icon: 'filter' },
    ],
  },
  { label: '智能服务', items: [{ label: 'AI 就业助手', path: '/user/ai-chat', icon: 'chat' }] },
];
