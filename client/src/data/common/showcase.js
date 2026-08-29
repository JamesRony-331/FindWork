export const showcaseTicker = [
  '岗位需求 +18.6%',
  '人工智能 +32.6%',
  '大数据 +28.4%',
  '新能源汽车 +24.1%',
  '芯片设计 +19.8%',
  '数字化运营 +18.7%',
];

export const showcaseHeroPoints = [
  { icon: 'layers', title: '多源数据聚合', text: '整合招聘平台与公开岗位数据' },
  { icon: 'chart', title: '智能分析洞察', text: '识别岗位变化与就业机会' },
  { icon: 'filter', title: '结构化数据', text: '便于后续直接接入后端接口' },
];

export const showcaseSections = [
  {
    key: 'demand',
    index: '01',
    theme: 'light',
    icon: 'briefcase',
    title: '岗位需求分析',
    description:
      '多维度解析岗位需求变化趋势，洞察热门行业、技能要求与人才缺口，为求职规划提供依据。',
    metrics: [
      { value: '12,680', label: '岗位总量' },
      { value: '18.6%', label: '需求增长率' },
      { value: '1,245', label: '细分职业标签' },
    ],
    chartTitle: '岗位需求趋势',
    chartValues: [34, 52, 43, 65, 58, 78],
    ranking: [
      { name: '软件开发工程师', value: '12.6%' },
      { name: '前端开发工程师', value: '9.8%' },
      { name: '数据分析师', value: '8.7%' },
      { name: '测试工程师', value: '6.3%' },
      { name: '产品经理', value: '5.1%' },
    ],
  },
  {
    key: 'salary',
    index: '02',
    theme: 'dark',
    icon: 'salary',
    title: '薪资水平分析',
    description: '全面呈现不同专业、岗位与经验阶段的薪资分布，掌握市场薪酬水平，明确自身价值定位。',
    metrics: [
      { value: '13.6K', label: '平均月薪' },
      { value: '26.7K', label: '年薪中位数' },
      { value: '23.4%', label: '同比增长' },
    ],
    chartTitle: '薪资分布区间',
    chartValues: [28, 47, 59, 86, 55, 24],
    ranking: [
      { name: '人工智能', value: '19.8K' },
      { name: '金融科技', value: '18.5K' },
      { name: '芯片设计', value: '17.3K' },
      { name: '大数据', value: '16.2K' },
      { name: '新能源', value: '15.7K' },
    ],
  },
  {
    key: 'city',
    index: '03',
    theme: 'light',
    icon: 'location',
    title: '城市就业分析',
    description:
      '洞察重点城市就业机会与人才流动趋势，结合生活成本与发展潜力，找到更适合的就业城市。',
    metrics: [
      { value: '36', label: '覆盖城市' },
      { value: '47.8%', label: '一线城市占比' },
      { value: '28.6%', label: '新一线增速' },
    ],
    chartTitle: '城市岗位机会',
    chartValues: [88, 79, 72, 61, 54, 46],
    ranking: [
      { name: '北京', value: '2,860' },
      { name: '上海', value: '2,410' },
      { name: '深圳', value: '2,180' },
      { name: '杭州', value: '1,720' },
      { name: '广州', value: '1,460' },
    ],
  },
  {
    key: 'ai',
    index: '04',
    theme: 'dark',
    icon: 'chat',
    title: 'AI 就业助手',
    description: '结合岗位数据提供个性化求职建议，辅助梳理职业方向、能力差距与简历优化重点。',
    metrics: [
      { value: '92%', label: '岗位匹配参考' },
      { value: '24h', label: '随时获取建议' },
      { value: '4类', label: '就业辅助能力' },
    ],
    chartTitle: '岗位匹配建议',
    chartValues: [92, 88, 85, 78, 72, 66],
    ranking: [
      { name: '产品经理', value: '92%' },
      { name: '数据分析师', value: '88%' },
      { name: '运营专员', value: '85%' },
      { name: '前端工程师', value: '78%' },
      { name: '测试工程师', value: '72%' },
    ],
  },
];

export const showcaseProofs = [
  { icon: 'chart', value: '每日更新', label: '数据更新频率' },
  { icon: 'location', value: '全国 36 个城市', label: '数据覆盖范围' },
  { icon: 'layers', value: '200+ 权威平台', label: '数据来源渠道' },
  { icon: 'briefcase', value: '28,590 条', label: '有效岗位记录' },
];

export function mountShowcaseMotion(root) {
  if (!root || typeof IntersectionObserver === 'undefined') return () => {};
  const revealItems = [...root.querySelectorAll('[data-reveal]')];
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.16 },
  );
  revealItems.forEach((item) => observer.observe(item));
  const pointer = (event) =>
    root.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth - 0.5) * 18}px`);
  window.addEventListener('pointermove', pointer, { passive: true });
  return () => {
    observer.disconnect();
    window.removeEventListener('pointermove', pointer);
  };
}
