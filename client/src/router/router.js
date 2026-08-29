const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/common/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/common/LoginView.vue'),
  },
  {
    path: '/showcase',
    name: 'Showcase',
    component: () => import('../views/common/ShowcaseView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/common/RegisterView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/common/ProfileView.vue'),
  },
  {
    path: '/user/dashboard',
    name: 'UserDashboard',
    component: () => import('../views/user/UserDashboardView.vue'),
  },
  {
    path: '/user/dashboard/charts',
    name: 'UserDashboardCharts',
    component: () => import('../views/user/UserDashboardChartsView.vue'),
  },
  {
    path: '/user/analysis/job-demand',
    name: 'JobDemandAnalysis',
    component: () => import('../views/user/analysis/JobDemandAnalysisView.vue'),
  },
  {
    path: '/user/analysis/salary',
    name: 'SalaryAnalysis',
    component: () => import('../views/user/analysis/SalaryAnalysisView.vue'),
  },
  {
    path: '/user/analysis/city',
    name: 'CityAnalysis',
    component: () => import('../views/user/analysis/CityAnalysisView.vue'),
  },
  {
    path: '/user/analysis/education',
    name: 'EducationAnalysis',
    component: () => import('../views/user/analysis/EducationAnalysisView.vue'),
  },
  {
    path: '/user/analysis/major',
    name: 'MajorAnalysis',
    component: () => import('../views/user/analysis/MajorAnalysisView.vue'),
  },
  {
    path: '/user/analysis/multi',
    name: 'MultiDimensionAnalysis',
    component: () => import('../views/user/analysis/MultiDimensionAnalysisView.vue'),
  },
  {
    path: '/user/jobs',
    name: 'UserJobs',
    component: () => import('../views/user/jobs/UserJobsView.vue'),
  },
  {
    path: '/user/jobs/:id',
    name: 'UserJobDetail',
    component: () => import('../views/user/jobs/UserJobDetailView.vue'),
  },
  {
    path: '/user/ai-chat',
    name: 'AiChat',
    component: () => import('../views/user/AiChatView.vue'),
  },
];

const pageTitles = {
  Home: '首页',
  Showcase: '系统展示',
  Login: '用户登录',
  Register: '用户注册',
  Profile: '个人信息',
  UserDashboard: '数据看板',
  UserDashboardCharts: '图表总览',
  JobDemandAnalysis: '岗位需求分析',
  SalaryAnalysis: '薪资水平分析',
  CityAnalysis: '城市与区域分析',
  EducationAnalysis: '学历层次分析',
  MajorAnalysis: '专业细分方向分析',
  MultiDimensionAnalysis: '多维度分析',
  UserJobs: '岗位数据查询',
  UserJobDetail: '岗位详情',
  AiChat: 'AI 就业助手',
};

for (const route of routes) {
  if (pageTitles[route.name])
    route.meta = {
      title: pageTitles[route.name],
      layout: route.path.startsWith('/user') || route.path === '/profile' ? 'user' : 'public',
    };
}

export default routes;
