import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { isDemoAuthenticated } from '../utils/demoSession.js'

const DashboardPlaceholder = {
  template: '<main aria-label="招聘数据管理大屏"></main>',
}

const LoginView = typeof window === 'undefined'
  ? DashboardPlaceholder
  : () => import('../views/LoginView.vue')

export const routes = [
  {
    path: '/',
    redirect: () => (isDemoAuthenticated() ? '/dashboard' : '/login'),
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: DashboardPlaceholder,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authenticated = isDemoAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    return { name: 'AdminLogin' }
  }

  if (to.name === 'AdminLogin' && authenticated) {
    return { name: 'AdminDashboard' }
  }

  return true
})

export default router
