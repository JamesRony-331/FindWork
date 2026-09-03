import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { getUserMenus } from '../api/admin.js'
import { clearAuthSession, getAuthToken, isAdminAuthenticated } from '../utils/authSession.js'
import { buildDynamicRouteRecords } from './dynamicRoutes.js'

const ViewPlaceholder = {
  template: '<main aria-label="招聘数据管理大屏"></main>',
}

const view = (loader) => typeof window === 'undefined' ? ViewPlaceholder : loader
const LoginView = view(() => import('../views/LoginView.vue'))
const AdminLayout = view(() => import('../layouts/AdminLayout.vue'))

export const routeComponentLoaders = {
  DashboardView: view(() => import('../views/DashboardView.vue')),
  ProfileView: view(() => import('../views/ProfileView.vue')),
  UserManagementView: view(() => import('../views/UserManagementView.vue')),
  MenuManagementView: view(() => import('../views/system/MenuManagementView.vue')),
  RoleManagementView: view(() => import('../views/system/RoleManagementView.vue')),
  PermissionManagementView: view(() => import('../views/system/PermissionManagementView.vue')),
}

export const staticRoutes = [
  {
    path: '/',
    redirect: () => (isAdminAuthenticated() ? '/dashboard' : '/login'),
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: LoginView,
  },
  {
    path: '/',
    name: 'AdminLayout',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'DynamicRouteBootstrap',
        component: ViewPlaceholder,
        meta: { requiresAuth: true, dynamicRouteBootstrap: true },
      },
    ],
  },
]

// 保留原导出名，供现有代码和测试读取静态基础路由。
export const routes = staticRoutes

async function loadMenusFromApi() {
  const response = await getUserMenus()
  if (response.code !== 200 || !Array.isArray(response.data)) {
    throw new Error(response.info || '菜单加载失败')
  }
  return response.data
}

export function createAdminRouter({ loadMenus = loadMenusFromApi } = {}) {
  const router = createRouter({
    history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(),
    routes: staticRoutes,
  })

  let dynamicRoutesLoaded = false
  let dynamicRoutesPromise = null
  let defaultRoutePath = '/dashboard'
  let loadedToken = null
  let removeDynamicRoutes = []

  function resetDynamicRoutes() {
    for (const removeRoute of removeDynamicRoutes.splice(0)) removeRoute()
    dynamicRoutesLoaded = false
    dynamicRoutesPromise = null
    defaultRoutePath = '/dashboard'
    loadedToken = null
  }

  async function ensureDynamicRoutes() {
    if (dynamicRoutesLoaded) return
    if (dynamicRoutesPromise) return dynamicRoutesPromise

    dynamicRoutesPromise = Promise.resolve(loadMenus())
      .then((menus) => {
        const records = buildDynamicRouteRecords(menus, routeComponentLoaders)
        if (!records.length) throw new Error('当前账号暂无可访问页面')
        removeDynamicRoutes = records.map((record) => router.addRoute('AdminLayout', record))
        defaultRoutePath = records.find((record) => record.path === '/dashboard')?.path
          || records[0]?.path
          || '/login'
        loadedToken = getAuthToken()
        dynamicRoutesLoaded = true
      })
      .finally(() => {
        dynamicRoutesPromise = null
      })

    return dynamicRoutesPromise
  }

  router.beforeEach(async (to) => {
    const authenticated = isAdminAuthenticated()

    if (!authenticated) {
      if (dynamicRoutesLoaded) resetDynamicRoutes()
      return to.name === 'AdminLogin' ? true : { name: 'AdminLogin' }
    }

    if (dynamicRoutesLoaded && loadedToken !== getAuthToken()) resetDynamicRoutes()

    try {
      if (!dynamicRoutesLoaded) {
        await ensureDynamicRoutes()
        if (to.name === 'AdminLogin') return defaultRoutePath
        return to.fullPath
      }
    } catch {
      clearAuthSession()
      return { name: 'AdminLogin' }
    }

    if (to.name === 'AdminLogin') return defaultRoutePath
    if (to.meta.dynamicRouteBootstrap) return defaultRoutePath
    return true
  })

  return router
}

export default createAdminRouter()
