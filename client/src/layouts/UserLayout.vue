<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppIcon from '../components/common/AppIcon.vue';
import { topbarNavItems, userNavGroups } from '../data/navigation';
import { getUserDisplayName, readStoredUser } from '../data/common/profile.js';

const route = useRoute();
const collapsed = ref(false);
const user = reactive(readStoredUser(localStorage));
const displayName = computed(() => getUserDisplayName(user));
const currentTitle = computed(() => route.meta.title || '数据服务平台');

function syncUser(event) {
  Object.assign(user, event.detail || readStoredUser(localStorage));
}

onMounted(() => window.addEventListener('user-info-updated', syncUser));
onBeforeUnmount(() => window.removeEventListener('user-info-updated', syncUser));
</script>
<template>
  <div class="user-layout" :class="{ 'sidebar-collapsed': collapsed }">
    <aside class="user-sidebar">
      <router-link class="sidebar-brand" to="/user/dashboard">
        <span class="brand-mark">毕</span>
        <span class="brand-copy">
          高校毕业生招聘
          <br />
          信息采集分析系统
        </span>
      </router-link>
      <nav class="sidebar-nav" aria-label="用户导航">
        <section v-for="group in userNavGroups" :key="group.label" class="nav-group">
          <h2 class="nav-group-title">{{ group.label }}</h2>
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
          >
            <AppIcon :name="item.icon" />
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </section>
      </nav>
    </aside>
    <div class="user-main">
      <header class="user-topbar">
        <button
          class="topbar-menu"
          type="button"
          aria-label="收起或展开导航"
          @click="collapsed = !collapsed"
        >
          <AppIcon name="menu" />
        </button>
        <div class="topbar-title">
          <span class="topbar-platform">数据服务平台</span>
          <span class="topbar-separator">/</span>
          <strong>{{ currentTitle }}</strong>
        </div>
        <nav class="topbar-links" aria-label="快捷导航">
          <router-link v-for="item in topbarNavItems" :key="item.path" :to="item.path">
            {{ item.label }}
          </router-link>
        </nav>
        <router-link class="topbar-user" to="/profile">
          <span class="user-icon"><AppIcon name="user" /></span>
          <span>{{ displayName }}</span>
        </router-link>
      </header>
      <main><slot /></main>
    </div>
  </div>
</template>

<style scoped>
.user-layout {
  min-height: 100vh;
}
.user-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  width: var(--sidebar-width);
  overflow-y: auto;
  color: #dbe9ee;
  background: var(--color-primary-900);
  transition: width 0.2s;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: var(--topbar-height);
  padding: 0 18px;
  color: #fff;
  font-weight: 700;
  line-height: 1.35;
}
.brand-mark {
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  height: 34px;
  border-radius: 6px;
  background: var(--color-accent);
}
.sidebar-nav {
  padding: 12px 10px 24px;
}
.nav-group + .nav-group {
  margin-top: 16px;
}
.nav-group-title {
  padding: 0 12px 6px;
  color: #779aaa;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.12em;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  color: #c6d9e1;
}
.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}
.nav-item.active {
  color: #fff;
  background: #0b657d;
  box-shadow: inset 3px 0 #42d2c7;
}
.user-main {
  min-height: 100vh;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.2s;
}
.user-topbar {
  position: sticky;
  top: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  height: var(--topbar-height);
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
}
.topbar-menu {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: var(--color-primary-900);
  background: transparent;
}
.topbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  color: var(--color-text-secondary);
}
.topbar-title strong {
  color: var(--color-primary-900);
  font-size: 14px;
  font-weight: 650;
}
.topbar-separator {
  color: var(--color-border-strong);
}
.topbar-links {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.topbar-links a {
  padding: 8px 12px;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  font-size: 13px;
}
.topbar-links a:hover,
.topbar-links a.router-link-active {
  color: var(--color-primary-700);
  background: var(--color-accent-soft);
}
.topbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 14px;
  padding-left: 16px;
  border-left: 1px solid var(--color-border);
  color: var(--color-primary-900);
  font-size: 13px;
  font-weight: 600;
}
.user-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--color-primary-700);
  background: var(--color-accent-soft);
}
.sidebar-collapsed .user-sidebar {
  width: 68px;
}
.sidebar-collapsed .user-main {
  margin-left: 68px;
}
.sidebar-collapsed .brand-copy,
.sidebar-collapsed .nav-label,
.sidebar-collapsed .nav-group-title {
  display: none;
}
.sidebar-collapsed .sidebar-brand {
  padding: 0 17px;
}
.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0;
}
.sidebar-collapsed .nav-group + .nav-group {
  margin-top: 8px;
}
@media (max-width: 760px) {
  .user-sidebar {
    width: 68px;
  }
  .user-main,
  .sidebar-collapsed .user-main {
    margin-left: 68px;
  }
  .brand-copy,
  .nav-label,
  .nav-group-title {
    display: none;
  }
  .sidebar-brand {
    padding: 0 17px;
  }
  .nav-item {
    justify-content: center;
    padding: 0;
  }
  .user-topbar {
    padding: 0 14px;
  }
  .topbar-platform,
  .topbar-separator,
  .topbar-links {
    display: none;
  }
  .topbar-title {
    margin-left: 8px;
  }
  .topbar-user {
    margin-left: auto;
    padding-left: 10px;
  }
  .topbar-user span {
    display: none;
  }
}
</style>
