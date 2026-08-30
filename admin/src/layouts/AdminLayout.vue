<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { dashboardMeta } from '../data/dashboard.js'
import { adminNavigation } from '../data/navigation.js'
import { clearDemoSession, readDemoSession } from '../utils/demoSession.js'
import { navigationPresentation, toggleNavigationState } from '../utils/navigationState.js'

const route = useRoute()
const router = useRouter()
const viewportWidth = ref(typeof window === 'undefined' ? 1440 : window.innerWidth)
const collapsed = ref(viewportWidth.value <= 1100)
const mobileOpen = ref(false)
const logoutOpen = ref(false)
const administrator = readDemoSession()?.username || '管理员'
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

onMounted(() => window.addEventListener('resize', updateViewportWidth))
onBeforeUnmount(() => window.removeEventListener('resize', updateViewportWidth))

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

function toggleNavigation() {
  const nextState = toggleNavigationState({
    collapsed: collapsed.value,
    mobileOpen: mobileOpen.value,
  }, viewportWidth.value)

  collapsed.value = nextState.collapsed
  mobileOpen.value = nextState.mobileOpen
}

function confirmLogout() {
  clearDemoSession()
  logoutOpen.value = false
  router.replace('/login')
}
</script>

<template>
  <div
    class="admin-shell"
    :class="{ 'admin-shell--collapsed': collapsed, 'admin-shell--mobile-open': mobileOpen }"
  >
    <aside id="admin-navigation" class="admin-sidebar" aria-label="管理端主导航">
      <div class="admin-sidebar__brand">
        <span class="admin-sidebar__mark" aria-hidden="true">G</span>
        <strong class="admin-sidebar__brand-text">GoWorking 管理端</strong>
      </div>

      <nav class="admin-sidebar__nav">
        <template v-for="item in adminNavigation" :key="item.id">
          <RouterLink
            v-if="!item.disabled"
            class="admin-sidebar__item admin-sidebar__item--active"
            :to="item.to"
            :title="collapsed ? item.label : undefined"
            @click="mobileOpen = false"
          >
            <AppIcon :name="item.icon" />
            <span class="admin-sidebar__label">{{ item.label }}</span>
          </RouterLink>
          <div
            v-else
            class="admin-sidebar__item admin-sidebar__item--disabled"
            :title="collapsed ? `${item.label}（${item.badge}）` : undefined"
            aria-disabled="true"
          >
            <AppIcon :name="item.icon" />
            <span class="admin-sidebar__label">{{ item.label }}</span>
            <span class="admin-sidebar__badge">{{ item.badge }}</span>
          </div>
        </template>
      </nav>
    </aside>

    <button
      v-if="mobileOpen"
      class="admin-shell__scrim"
      type="button"
      aria-label="关闭导航"
      @click="mobileOpen = false"
    ></button>

    <div class="admin-shell__workspace">
      <header class="admin-header">
        <div class="admin-header__leading">
          <button
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
            <span>首页</span><span aria-hidden="true">/</span><strong>数据大屏</strong>
          </nav>
        </div>

        <div class="admin-header__meta">
          <span class="admin-header__updated">
            <AppIcon name="clock" />
            数据更新：<time :datetime="dashboardMeta.updatedAt">{{ dashboardMeta.updateLabel }}</time>
          </span>
          <span class="admin-header__user" :title="administrator">{{ administrator }}</span>
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

.admin-shell__scrim {
  position: fixed;
  z-index: 9;
  inset: 0;
  width: 100%;
  background: var(--color-nav);
}

@media (prefers-reduced-motion: reduce) {
  .admin-sidebar,
  .admin-shell__workspace {
    transition: none;
  }
}
</style>
