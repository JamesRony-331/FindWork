<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { getRequestErrorMessage, getUserMenus } from '../api/admin.js'
import { dashboardMeta } from '../data/dashboard.js'
import { clearAuthSession, readAuthSession } from '../utils/authSession.js'
import { buildAdminNavigation } from '../utils/menuNavigation.js'
import { navigationPresentation, toggleNavigationState } from '../utils/navigationState.js'

const route = useRoute()
const router = useRouter()
const viewportWidth = ref(typeof window === 'undefined' ? 1440 : window.innerWidth)
const collapsed = ref(viewportWidth.value <= 1100)
const mobileOpen = ref(false)
const logoutOpen = ref(false)
const openGroups = ref(new Set())
const navigationItems = ref([])
const menuLoading = ref(true)
const menuError = ref('')
const navigationRef = ref(null)
const menuButtonRef = ref(null)
const administratorSession = readAuthSession()
const administrator = administratorSession?.user?.nickname || administratorSession?.user?.email || '管理员'
const isMobileNavigation = computed(() => viewportWidth.value <= 720)
const navigationHidden = computed(() => isMobileNavigation.value && !mobileOpen.value)
const workspaceHidden = computed(() => isMobileNavigation.value && mobileOpen.value)
const navigationExpanded = computed(() => navigationPresentation({
  collapsed: collapsed.value,
  mobileOpen: mobileOpen.value,
}, viewportWidth.value).expanded)
const navigationToggleLabel = computed(() => {
  if (viewportWidth.value <= 720 && mobileOpen.value) return '关闭导航'
  return navigationExpanded.value ? '收起导航' : '展开导航'
})

function updateViewportWidth() {
  const previousWidth = viewportWidth.value
  const nextWidth = window.innerWidth

  if (previousWidth > 1100 && nextWidth <= 1100) collapsed.value = true
  if (previousWidth <= 720 && nextWidth > 720) mobileOpen.value = false
  viewportWidth.value = nextWidth
}

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth)
  loadNavigation()
})
onBeforeUnmount(() => window.removeEventListener('resize', updateViewportWidth))

watch(() => route.fullPath, () => {
  expandActiveGroup()
  closeMobileNavigation()
})

async function loadNavigation() {
  menuLoading.value = true
  menuError.value = ''
  try {
    const response = await getUserMenus()
    if (response.code !== 200) throw new Error(response.info || '菜单加载失败')
    navigationItems.value = buildAdminNavigation(response.data)
    expandActiveGroup()
  } catch (error) {
    navigationItems.value = []
    menuError.value = getRequestErrorMessage(error)
  } finally {
    menuLoading.value = false
  }
}

function expandActiveGroup() {
  const active = navigationItems.value.find((item) => item.children.some((child) => route.path === child.to))
  if (active) openGroups.value = new Set([...openGroups.value, active.id])
}

function isGroupOpen(id) {
  return openGroups.value.has(id)
}

function toggleGroup(id) {
  const next = new Set(openGroups.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openGroups.value = next
}

const breadcrumbSection = computed(() => route.meta.section)
const breadcrumbTitle = computed(() => route.meta.title || '数据大屏')
const isDashboard = computed(() => route.name === 'AdminDashboard')

watch(mobileOpen, async (isOpen) => {
  if (!isMobileNavigation.value) return
  await nextTick()

  if (isOpen) {
    navigationRef.value?.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus()
    return
  }

  menuButtonRef.value?.focus()
})

function toggleNavigation() {
  const nextState = toggleNavigationState({
    collapsed: collapsed.value,
    mobileOpen: mobileOpen.value,
  }, viewportWidth.value)

  collapsed.value = nextState.collapsed
  mobileOpen.value = nextState.mobileOpen
}

function closeMobileNavigation() {
  if (mobileOpen.value) mobileOpen.value = false
}

function handleShellKeydown(event) {
  if (event.key !== 'Escape' || !mobileOpen.value || !isMobileNavigation.value) return
  event.preventDefault()
  closeMobileNavigation()
}

function confirmLogout() {
  clearAuthSession()
  logoutOpen.value = false
  router.replace('/login')
}
</script>

<template>
  <div
    class="admin-shell"
    :class="{ 'admin-shell--collapsed': collapsed, 'admin-shell--mobile-open': mobileOpen }"
    @keydown="handleShellKeydown"
  >
    <aside
      id="admin-navigation"
      ref="navigationRef"
      class="admin-sidebar"
      aria-label="管理端主导航"
      :inert="navigationHidden ? '' : undefined"
      :aria-hidden="navigationHidden ? 'true' : undefined"
    >
      <div class="admin-sidebar__brand">
        <span class="admin-sidebar__mark" aria-hidden="true">G</span>
        <strong class="admin-sidebar__brand-text">GoWorking 管理端</strong>
      </div>

      <nav class="admin-sidebar__nav">
        <p v-if="menuLoading" class="admin-sidebar__state" aria-live="polite">正在加载菜单…</p>
        <div v-else-if="menuError" class="admin-sidebar__state" role="alert">
          <span>{{ menuError }}</span>
          <button type="button" @click="loadNavigation">重新加载菜单</button>
        </div>
        <p v-else-if="!navigationItems.length" class="admin-sidebar__state">当前账号暂无可用菜单</p>
        <template v-for="item in navigationItems" :key="item.id">
          <RouterLink
            v-if="!item.children.length"
            class="admin-sidebar__item"
            active-class="admin-sidebar__item--active"
            :to="item.to"
            :title="collapsed ? item.label : undefined"
            @click="closeMobileNavigation"
          >
            <AppIcon :name="item.icon" />
            <span class="admin-sidebar__label">{{ item.label }}</span>
          </RouterLink>
          <div v-else class="admin-sidebar__group">
            <button
              class="admin-sidebar__item admin-sidebar__group-toggle"
              :class="{ 'admin-sidebar__item--parent-active': item.children.some((child) => route.path === child.to) }"
              type="button"
              :title="collapsed ? item.label : undefined"
              :aria-expanded="isGroupOpen(item.id)"
              @click="toggleGroup(item.id)"
            >
              <AppIcon :name="item.icon" />
              <span class="admin-sidebar__label">{{ item.label }}</span>
              <AppIcon class="admin-sidebar__chevron" name="chevron" />
            </button>
            <div
              class="admin-sidebar__children-collapse"
              :class="{ 'admin-sidebar__children-collapse--open': isGroupOpen(item.id) }"
              :inert="isGroupOpen(item.id) ? undefined : ''"
              :aria-hidden="isGroupOpen(item.id) ? undefined : 'true'"
            >
              <div class="admin-sidebar__children">
                <div class="admin-sidebar__children-list">
                  <RouterLink
                    v-for="child in item.children"
                    :key="child.id"
                    class="admin-sidebar__child"
                    active-class="admin-sidebar__child--active"
                    :to="child.to"
                    @click="closeMobileNavigation"
                  >
                    <AppIcon :name="child.icon" />
                    <span>{{ child.label }}</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <button
      v-if="mobileOpen"
      class="admin-shell__scrim"
      type="button"
      aria-label="关闭导航"
      @click="closeMobileNavigation"
    ></button>

    <div
      class="admin-shell__workspace"
      :inert="workspaceHidden ? '' : undefined"
      :aria-hidden="workspaceHidden ? 'true' : undefined"
    >
      <header class="admin-header">
        <div class="admin-header__leading">
          <button
            ref="menuButtonRef"
            class="admin-header__menu"
            type="button"
            aria-controls="admin-navigation"
            :aria-expanded="navigationExpanded"
            :aria-label="navigationToggleLabel"
            @click="toggleNavigation"
          >
            <AppIcon name="menu" />
          </button>
          <nav class="admin-breadcrumbs" aria-label="面包屑">
            <span>首页</span><span aria-hidden="true">/</span>
            <template v-if="breadcrumbSection">
              <span>{{ breadcrumbSection }}</span><span aria-hidden="true">/</span>
            </template>
            <strong>{{ breadcrumbTitle }}</strong>
          </nav>
        </div>

        <div class="admin-header__meta">
          <span v-if="isDashboard" class="admin-header__updated">
            <AppIcon name="clock" />
            数据更新：<time :datetime="dashboardMeta.updatedAt">{{ dashboardMeta.updateLabel }}</time>
          </span>
          <RouterLink class="admin-header__user" to="/profile" :title="`${administrator}的个人主页`">{{ administrator }}</RouterLink>
          <button class="admin-header__logout" type="button" @click="logoutOpen = true">
            <AppIcon name="logout" />
            <span>退出</span>
          </button>
        </div>
      </header>

      <main class="admin-main">
        <RouterView />
      </main>
    </div>

    <ConfirmDialog
      :open="logoutOpen"
      title="确认退出"
      message="退出后将返回管理端登录页，确定继续吗？"
      @cancel="logoutOpen = false"
      @confirm="confirmLogout"
    />
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--color-page);
}

.admin-sidebar {
  position: fixed;
  z-index: 10;
  inset: 0 auto 0 0;
  width: 224px;
  overflow: hidden;
  background: var(--color-nav);
  color: var(--color-surface);
  transition: width 180ms ease, transform 180ms ease;
}

.admin-sidebar__brand {
  display: flex;
  height: 64px;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-6);
  white-space: nowrap;
}

.admin-sidebar__mark {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-surface);
  border-radius: var(--radius-control);
  font-weight: 700;
}

.admin-sidebar__brand-text {
  font-size: 18px;
}

.admin-sidebar__nav {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) 0;
}

.admin-sidebar__state {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  color: var(--color-surface);
  font-size: var(--font-size-caption);
}

.admin-sidebar__state button {
  justify-self: start;
  background: transparent;
  color: var(--color-surface);
  font-weight: 600;
  text-decoration: underline;
}

.admin-sidebar__item {
  display: grid;
  min-height: 56px;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-6);
  color: var(--color-surface);
  font-size: var(--font-size-body);
  white-space: nowrap;
}

.admin-sidebar__item--active {
  background: var(--color-primary);
  font-weight: 600;
}

.admin-sidebar__item--parent-active {
  background: var(--color-primary);
  font-weight: 600;
}

.admin-sidebar__group-toggle {
  width: 100%;
  background: transparent;
  text-align: left;
}

.admin-sidebar__chevron {
  width: 16px;
  height: 16px;
  transition: transform 160ms ease;
}

.admin-sidebar__group-toggle[aria-expanded="true"] .admin-sidebar__chevron {
  transform: rotate(180deg);
}

.admin-sidebar__children-collapse {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-6px);
  transition: grid-template-rows 220ms ease, opacity 180ms ease, transform 220ms ease;
}

.admin-sidebar__children-collapse--open {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}

.admin-sidebar__children {
  min-height: 0;
  overflow: hidden;
}

.admin-sidebar__children-list {
  display: grid;
  padding: var(--space-1) var(--space-3) var(--space-2) 44px;
}

.admin-sidebar__child {
  display: flex;
  min-height: 42px;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-3);
  border-radius: var(--radius-control);
  color: var(--color-surface);
}

.admin-sidebar__child .app-icon {
  width: 17px;
  height: 17px;
}

.admin-sidebar__child:hover,
.admin-sidebar__child--active {
  background: var(--color-primary);
  color: var(--color-surface);
}

.admin-sidebar__item--disabled {
  cursor: not-allowed;
}

.admin-sidebar__badge {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-control);
  color: var(--color-surface);
  font-size: var(--font-size-caption);
  line-height: 1;
}

.admin-shell__workspace {
  min-width: 0;
  padding-left: 224px;
  transition: padding-left 180ms ease;
}

.admin-header {
  position: sticky;
  z-index: 8;
  top: 0;
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: 0 var(--space-6);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.admin-header__leading,
.admin-header__meta,
.admin-header__updated,
.admin-breadcrumbs,
.admin-header__logout {
  display: flex;
  align-items: center;
}

.admin-header__leading,
.admin-header__meta {
  gap: var(--space-6);
}

.admin-header__menu,
.admin-header__logout {
  min-height: 36px;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-text);
}

.admin-header__menu {
  width: 36px;
  justify-content: center;
}

.admin-header__menu:hover,
.admin-header__logout:hover {
  color: var(--color-primary);
}

.admin-breadcrumbs {
  gap: var(--space-2);
  color: var(--color-muted);
  font-size: var(--font-size-body);
}

.admin-breadcrumbs strong {
  color: var(--color-text);
  font-weight: 500;
}

.admin-header__meta {
  color: var(--color-muted);
  font-size: var(--font-size-body);
}

.admin-header__updated,
.admin-header__logout {
  gap: var(--space-2);
}

.admin-header__updated .app-icon,
.admin-header__logout .app-icon {
  width: 18px;
  height: 18px;
}

.admin-header__user {
  max-width: 14ch;
  overflow: hidden;
  color: var(--color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-header__logout {
  padding: 0;
  font-size: var(--font-size-body);
}

.admin-main {
  min-width: 0;
  padding: var(--space-4) var(--space-6);
}

.admin-shell--collapsed .admin-sidebar {
  width: 72px;
}

.admin-shell--collapsed .admin-shell__workspace {
  padding-left: 72px;
}

.admin-shell--collapsed .admin-sidebar__brand,
.admin-shell--collapsed .admin-sidebar__item {
  padding-right: var(--space-6);
  padding-left: var(--space-6);
}

.admin-shell--collapsed .admin-sidebar__brand-text,
.admin-shell--collapsed .admin-sidebar__label,
.admin-shell--collapsed .admin-sidebar__badge {
  display: none;
}

.admin-shell--collapsed .admin-sidebar__children-collapse,
.admin-shell--collapsed .admin-sidebar__chevron {
  display: none;
}

.admin-shell--mobile-open .admin-sidebar__children-collapse {
  display: grid;
}

.admin-shell--mobile-open .admin-sidebar__chevron {
  display: block;
}

.admin-shell__scrim {
  position: fixed;
  z-index: 9;
  inset: 0;
  width: 100%;
  background: var(--color-nav);
}

@media (prefers-reduced-motion: reduce) {
  .admin-sidebar,
  .admin-shell__workspace,
  .admin-sidebar__children-collapse,
  .admin-sidebar__chevron {
    transition: none;
  }
}
</style>
