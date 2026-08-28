export const capabilities = [
  { icon: 'search', title: '查询岗位信息', description: '按城市、岗位、学历、薪资和专业方向快速筛选招聘信息', path: '/user/jobs' },
  { icon: 'chart', title: '洞察就业趋势', description: '查看岗位需求、薪资水平与城市就业机会的变化', path: '/user/dashboard' },
  { icon: 'education', title: '辅助就业判断', description: '结合学历层次和专业方向，了解更匹配的就业选择', path: '/user/analysis/education' },
]
export const previewCharts = [{ title: '岗位数量趋势', values: [34, 46, 42, 67, 55, 78] }, { title: '热门城市', values: [86, 73, 62, 49, 35] }]
export const previewNavItems = ['数据概览', '岗位数据', '薪资分析', '城市分析', '学历分析']
export function getHomeActions() { return [{ label: '进入系统', path: '/login', primary: true }, { label: '查看岗位', path: '/user/jobs', primary: false }] }
