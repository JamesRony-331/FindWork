import { filterRows, paginateRows, resetObject } from '../../utils/pageData.js';
export const pageMeta = {
  title: '岗位数据查询',
  description: '查询清洗和标准化后的高校毕业生招聘岗位',
  meta: '演示数据 · 共 12 条',
};
export const filterFields = [
  { key: 'keyword', label: '关键词', placeholder: '岗位或公司名称' },
  { key: 'city', label: '城市', type: 'select', options: ['北京', '上海', '深圳', '杭州', '广州'] },
  {
    key: 'standardJob',
    label: '标准岗位',
    type: 'select',
    options: ['软件开发工程师', '前端开发工程师', '测试工程师', '算法工程师', '数据分析师'],
  },
  { key: 'education', label: '学历', type: 'select', options: ['专科', '本科', '硕士'] },
  {
    key: 'salary',
    label: '薪资区间',
    type: 'select',
    options: ['5K-10K', '10K-15K', '15K-20K', '20K以上'],
  },
  {
    key: 'experience',
    label: '经验要求',
    type: 'select',
    options: ['应届生', '不限', '1-3年', '3-5年'],
  },
];
export const tableColumns = [
  { key: 'jobName', label: '岗位名称' },
  { key: 'standardJob', label: '标准岗位' },
  { key: 'company', label: '公司名称' },
  { key: 'city', label: '城市' },
  { key: 'education', label: '学历要求' },
  { key: 'salary', label: '薪资范围' },
  { key: 'source', label: '数据来源' },
  { key: 'publishDate', label: '发布时间' },
  { key: 'action', label: '操作', action: '查看详情' },
];
export const jobRows = [
  {
    id: '1',
    jobName: 'Java 开发工程师',
    standardJob: '软件开发工程师',
    company: '华云科技有限公司',
    city: '深圳',
    education: '本科',
    salary: '15K-25K',
    experience: '1-3年',
    source: '智联招聘',
    publishDate: '2025-05-19',
  },
  {
    id: '2',
    jobName: '前端开发工程师',
    standardJob: '前端开发工程师',
    company: '星海网络科技有限公司',
    city: '杭州',
    education: '本科',
    salary: '15K-20K',
    experience: '1-3年',
    source: 'BOSS直聘',
    publishDate: '2025-05-19',
  },
  {
    id: '3',
    jobName: '数据分析师',
    standardJob: '数据分析师',
    company: '远景数据服务有限公司',
    city: '上海',
    education: '本科',
    salary: '12K-20K',
    experience: '应届生',
    source: '前程无忧',
    publishDate: '2025-05-18',
  },
  {
    id: '4',
    jobName: '软件测试工程师',
    standardJob: '测试工程师',
    company: '明创软件股份有限公司',
    city: '深圳',
    education: '本科',
    salary: '10K-16K',
    experience: '1-3年',
    source: '智联招聘',
    publishDate: '2025-05-18',
  },
  {
    id: '5',
    jobName: '算法工程师',
    standardJob: '算法工程师',
    company: '智核人工智能研究院',
    city: '北京',
    education: '硕士',
    salary: '25K-40K',
    experience: '应届生',
    source: 'BOSS直聘',
    publishDate: '2025-05-18',
  },
  {
    id: '6',
    jobName: 'Java 后端开发',
    standardJob: '软件开发工程师',
    company: '云帆信息技术有限公司',
    city: '北京',
    education: '本科',
    salary: '18K-28K',
    experience: '3-5年',
    source: '拉勾网',
    publishDate: '2025-05-17',
  },
  {
    id: '7',
    jobName: '运维工程师',
    standardJob: '运维工程师',
    company: '联通数字科技有限公司',
    city: '广州',
    education: '专科',
    salary: '8K-14K',
    experience: '1-3年',
    source: '前程无忧',
    publishDate: '2025-05-17',
  },
  {
    id: '8',
    jobName: '产品经理',
    standardJob: '产品经理',
    company: '启明教育科技有限公司',
    city: '杭州',
    education: '本科',
    salary: '16K-24K',
    experience: '3-5年',
    source: '智联招聘',
    publishDate: '2025-05-16',
  },
  {
    id: '9',
    jobName: '网络安全工程师',
    standardJob: '安全工程师',
    company: '安澜网络安全有限公司',
    city: '上海',
    education: '本科',
    salary: '15K-26K',
    experience: '1-3年',
    source: 'BOSS直聘',
    publishDate: '2025-05-16',
  },
  {
    id: '10',
    jobName: '嵌入式开发工程师',
    standardJob: '嵌入式工程师',
    company: '海康威视数字技术有限公司',
    city: '杭州',
    education: '本科',
    salary: '14K-22K',
    experience: '应届生',
    source: '拉勾网',
    publishDate: '2025-05-16',
  },
  {
    id: '11',
    jobName: 'Python 开发工程师',
    standardJob: '软件开发工程师',
    company: '深图科技有限公司',
    city: '深圳',
    education: '本科',
    salary: '16K-25K',
    experience: '1-3年',
    source: 'BOSS直聘',
    publishDate: '2025-05-15',
  },
  {
    id: '12',
    jobName: '数据开发工程师',
    standardJob: '数据工程师',
    company: '博睿数据有限公司',
    city: '北京',
    education: '本科',
    salary: '18K-30K',
    experience: '1-3年',
    source: '智联招聘',
    publishDate: '2025-05-15',
  },
];
const defaults = {
  keyword: '',
  city: '',
  standardJob: '',
  education: '',
  salary: '',
  experience: '',
};
function matchesFilters(row, filters) {
  return (
    (!filters.city || row.city === filters.city) &&
    (!filters.standardJob || row.standardJob === filters.standardJob) &&
    (!filters.education || row.education === filters.education) &&
    (!filters.salary || row.salary.includes(filters.salary.replace('以上', ''))) &&
    (!filters.experience || row.experience === filters.experience)
  );
}
export function createJobsState() {
  const state = {
    filters: { ...defaults },
    pagination: { page: 1, pageSize: 8, total: jobRows.length },
    visibleRows: [],
    search() {
      const keywordRows = filterRows(jobRows, this.filters.keyword, [
        'jobName',
        'standardJob',
        'company',
      ]);
      const filtered = keywordRows.filter((row) => matchesFilters(row, this.filters));
      const result = paginateRows(filtered, 1, this.pagination.pageSize);
      this.visibleRows = result.rows;
      Object.assign(this.pagination, { page: result.page, total: result.total });
      return this.visibleRows;
    },
    reset() {
      resetObject(this.filters, defaults);
      return this.search();
    },
    changePage(page) {
      const keywordRows = filterRows(jobRows, this.filters.keyword, [
        'jobName',
        'standardJob',
        'company',
      ]).filter((row) => matchesFilters(row, this.filters));
      const result = paginateRows(keywordRows, page, this.pagination.pageSize);
      this.visibleRows = result.rows;
      Object.assign(this.pagination, { page: result.page, total: result.total });
      return this.visibleRows;
    },
  };
  state.search();
  return state;
}
