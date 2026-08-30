export const dashboardMeta = {
  title: '招聘数据管理大屏',
  description: '岗位采集、清洗与质量概况',
  isDemo: true,
  updatedAt: '2026-08-30T09:30:00+08:00',
  updateLabel: '2026-08-30 09:30',
}

export const metrics = [
  {
    id: 'job-count',
    label: '岗位数',
    value: 12480,
    unit: '条',
    change: 12.6,
    changeLabel: '较上周',
  },
  {
    id: 'user-count',
    label: '用户数',
    value: 2864,
    unit: '人',
    change: 8.4,
    changeLabel: '较上周',
  },
  {
    id: 'pending-cleanup',
    label: '待清洗记录',
    value: 736,
    unit: '条',
    change: -4.2,
    changeLabel: '较昨日',
  },
  {
    id: 'today-tasks',
    label: '今日采集任务',
    value: 18,
    unit: '项',
    change: 2,
    changeLabel: '进行中',
  },
]

export const collectionTrend = [
  { id: 'trend-2026-08-24', label: '08-24', value: 1860 },
  { id: 'trend-2026-08-25', label: '08-25', value: 2240 },
  { id: 'trend-2026-08-26', label: '08-26', value: 1980 },
  { id: 'trend-2026-08-27', label: '08-27', value: 2750 },
  { id: 'trend-2026-08-28', label: '08-28', value: 3120 },
  { id: 'trend-2026-08-29', label: '08-29', value: 2940 },
  { id: 'trend-2026-08-30', label: '08-30', value: 3380 },
]

export const sourceShare = [
  { id: 'source-official', label: '企业官网', value: 38 },
  { id: 'source-recruitment', label: '招聘平台', value: 32 },
  { id: 'source-government', label: '政府公开数据', value: 18 },
  { id: 'source-other', label: '其他来源', value: 12 },
]

export const cityRanking = [
  { id: 'city-hangzhou', label: '杭州', value: 2860 },
  { id: 'city-shanghai', label: '上海', value: 2540 },
  { id: 'city-shenzhen', label: '深圳', value: 2310 },
  { id: 'city-guangzhou', label: '广州', value: 1980 },
  { id: 'city-ningbo', label: '宁波', value: 1460 },
  { id: 'city-wenzhou', label: '温州', value: 1180 },
]

export const qualitySummary = [
  { id: 'quality-complete', label: '字段完整率', value: 96.8 },
  { id: 'quality-accurate', label: '内容准确率', value: 92.4 },
  { id: 'quality-duplicate', label: '去重通过率', value: 88.7 },
  { id: 'quality-timely', label: '更新及时率', value: 94.1 },
]

export const collectionTasks = [
  {
    id: 'task-official-sites',
    name: '企业官网岗位采集',
    source: '企业官网',
    lastRun: '今天 09:18',
    count: 1240,
    status: 'success',
    statusLabel: '已完成',
  },
  {
    id: 'task-recruitment-platforms',
    name: '招聘平台增量采集',
    source: '招聘平台',
    lastRun: '今天 09:26',
    count: 860,
    status: 'running',
    statusLabel: '采集中',
  },
  {
    id: 'task-government-data',
    name: '政府公开数据同步',
    source: '政府公开数据',
    lastRun: '今天 08:45',
    count: 530,
    status: 'warning',
    statusLabel: '部分异常',
  },
  {
    id: 'task-campus-recruitment',
    name: '校园招聘专题采集',
    source: '招聘平台',
    lastRun: '今天 07:52',
    count: 0,
    status: 'failed',
    statusLabel: '执行失败',
  },
]

export const recentActivities = [
  {
    id: 'activity-001',
    time: '09:28',
    operator: '管理员',
    action: '完成采集任务',
    target: '招聘平台增量采集',
  },
  {
    id: 'activity-002',
    time: '09:16',
    operator: '数据管理员',
    action: '导入岗位数据',
    target: '企业官网岗位采集',
  },
  {
    id: 'activity-003',
    time: '08:54',
    operator: '管理员',
    action: '提交数据清洗',
    target: '待清洗记录（736条）',
  },
  {
    id: 'activity-004',
    time: '08:40',
    operator: '系统管理员',
    action: '更新采集配置',
    target: '政府公开数据同步',
  },
]

export const alerts = [
  { id: 'alert-failed', label: '失败任务', count: 1, type: 'failed' },
  { id: 'alert-warning', label: '质量预警', count: 3, type: 'warning' },
  { id: 'alert-pending', label: '待清洗记录', count: 736, type: 'info' },
]
