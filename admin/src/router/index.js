import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { isDemoAuthenticated } from '../utils/demoSession.js'

const ViewPlaceholder = {
  template: '<main aria-label="招聘数据管理大屏"></main>',
}

const LoginView = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../views/LoginView.vue')
const AdminLayout = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../layouts/AdminLayout.vue')
const DashboardView = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../views/DashboardView.vue')
const MenuManagementView = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../views/system/MenuManagementView.vue')
const RoleManagementView = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../views/system/RoleManagementView.vue')
const PermissionManagementView = typeof window === 'undefined'
  ? ViewPlaceholder
  : () => import('../views/system/PermissionManagementView.vue')

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
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: DashboardView,
        meta: { title: '数据大屏' },
      },
      {
        path: '/system/menu',
        name: 'MenuManagement',
        component: MenuManagementView,
        meta: { section: '系统管理', title: '菜单管理' },
      },
      {
        path: '/system/role',
        name: 'RoleManagement',
        component: RoleManagementView,
        meta: { section: '系统管理', title: '角色管理' },
      },
      {
        path: '/system/permission',
        name: 'PermissionManagement',
        component: PermissionManagementView,
        meta: { section: '系统管理', title: '权限管理' },
      },
    ],
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
