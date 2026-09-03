<script setup>
import { computed, onMounted, ref } from 'vue'
import { getRequestErrorMessage, getUserPermissions, getUserRoles } from '../api/admin.js'
import AppIcon from '../components/AppIcon.vue'
import { readAuthSession } from '../utils/authSession.js'
import { groupPermissions } from '../utils/permissionGroups.js'

const session = readAuthSession()
const administrator = session?.user ?? {}
const roles = ref([])
const permissions = ref([])
const loading = ref(true)
const loadError = ref('')
const permissionSearch = ref('')
const openPermissionGroups = ref(new Set())
const permissionGroups = computed(() => groupPermissions(permissions.value, permissionSearch.value))

async function loadAccessProfile() {
  loading.value = true
  loadError.value = ''
  try {
    const [roleResponse, permissionResponse] = await Promise.all([getUserRoles(), getUserPermissions()])
    if (roleResponse.code !== 200) throw new Error(roleResponse.info || '角色信息加载失败')
    if (permissionResponse.code !== 200) throw new Error(permissionResponse.info || '权限信息加载失败')
    roles.value = Array.isArray(roleResponse.data) ? roleResponse.data : []
    permissions.value = Array.isArray(permissionResponse.data) ? permissionResponse.data : []
    const firstGroup = groupPermissions(permissions.value)[0]
    openPermissionGroups.value = new Set(firstGroup ? [firstGroup.id] : [])
  } catch (error) {
    loadError.value = getRequestErrorMessage(error)
  } finally {
    loading.value = false
  }
}

function togglePermissionGroup(groupId) {
  const next = new Set(openPermissionGroups.value)
  if (next.has(groupId)) next.delete(groupId)
  else next.add(groupId)
  openPermissionGroups.value = next
}

function isPermissionGroupOpen(groupId) {
  return Boolean(permissionSearch.value.trim()) || openPermissionGroups.value.has(groupId)
}

onMounted(loadAccessProfile)
</script>

<template>
  <section class="profile-page">
    <header class="profile-heading">
      <div>
        <h1>个人主页</h1>
        <p>查看当前管理员账号、角色与权限信息。</p>
      </div>
      <button class="button button--secondary" type="button" :disabled="loading" @click="loadAccessProfile">刷新权限</button>
    </header>

    <section class="profile-summary panel" aria-labelledby="profile-basic-title">
      <div class="profile-avatar" aria-hidden="true">{{ (administrator.nickname || administrator.email || '管').slice(0, 1).toUpperCase() }}</div>
      <div class="profile-summary__identity">
        <p class="profile-summary__eyebrow">管理员账号</p>
        <h2 id="profile-basic-title">{{ administrator.nickname || '未设置昵称' }}</h2>
        <p>{{ administrator.email || '未设置账号' }}</p>
      </div>
      <dl class="profile-basic">
        <div><dt>基本信息</dt><dd>管理端用户</dd></div>
        <div><dt>账号状态</dt><dd><span class="status status--success">正常</span></dd></div>
        <div><dt>登录方式</dt><dd>JWT 身份认证</dd></div>
      </dl>
    </section>

    <p v-if="loadError" class="profile-error panel" role="alert">
      {{ loadError }}
      <button type="button" @click="loadAccessProfile">重新加载</button>
    </p>
    <p v-else-if="loading" class="profile-loading panel" aria-live="polite">正在加载角色和权限信息…</p>

    <div v-else class="profile-access">
      <section class="profile-card panel" aria-labelledby="profile-role-title">
        <header><div><h2 id="profile-role-title">角色信息</h2><p>当前账号已分配 {{ roles.length }} 个角色</p></div><span>{{ roles.length }}</span></header>
        <div v-if="roles.length" class="role-list">
          <article v-for="role in roles" :key="role.id" class="role-list__item">
            <div class="profile-list__icon">角</div>
            <dl><div><dt>角色名称</dt><dd>{{ role.roleName }}</dd></div><div><dt>角色编码</dt><dd><code>{{ role.roleCode }}</code></dd></div></dl>
          </article>
        </div>
        <p v-else class="profile-empty">暂未分配角色</p>
      </section>

      <section class="profile-card panel" aria-labelledby="profile-permission-title">
        <header class="permission-header">
          <div><h2 id="profile-permission-title">权限信息</h2><p>当前角色共包含 {{ permissions.length }} 项权限，已按业务模块整理</p></div>
          <span>{{ permissions.length }}</span>
        </header>
        <div v-if="permissions.length" class="permission-content">
          <label class="permission-search">
            <span class="sr-only">权限搜索</span>
            <AppIcon name="search" />
            <input v-model="permissionSearch" type="search" placeholder="搜索权限名称或编码" />
          </label>
          <div class="permission-groups" aria-label="权限分组">
            <section v-for="group in permissionGroups" :key="group.id" class="permission-group">
              <button
                class="permission-group__toggle"
                type="button"
                :aria-expanded="isPermissionGroupOpen(group.id)"
                @click="togglePermissionGroup(group.id)"
              >
                <span><strong>{{ group.label }}</strong><small>{{ group.permissions.length }} 项权限</small></span>
                <AppIcon name="chevron" />
              </button>
              <div
                class="permission-collapse"
                :class="{ 'permission-collapse--open': isPermissionGroupOpen(group.id) }"
                :aria-hidden="isPermissionGroupOpen(group.id) ? undefined : 'true'"
              >
                <div class="permission-collapse__inner">
                  <div class="permission-list">
                    <article v-for="permission in group.permissions" :key="permission.id" class="permission-item">
                      <div class="profile-list__icon">权</div>
                      <div>
                        <strong><span class="sr-only">权限名称：</span>{{ permission.permissionName }}</strong>
                        <code><span class="sr-only">权限编码：</span>{{ permission.permissionCode }}</code>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <p v-if="permissionGroups.length === 0" class="profile-empty">没有匹配的权限</p>
        </div>
        <p v-else class="profile-empty">暂未分配权限</p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.profile-page { display: grid; gap: var(--space-4); }
.profile-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) 0; }
.profile-heading h1 { font-size: var(--font-size-title); }
.profile-heading p, .profile-card header p, .profile-summary__identity p { margin-top: var(--space-2); color: var(--color-muted); }
.profile-summary { display: grid; grid-template-columns: auto minmax(180px, .65fr) 1fr; align-items: center; gap: var(--space-6); padding: var(--space-6); }
.profile-avatar { display: grid; width: 72px; height: 72px; place-items: center; border-radius: 50%; background: var(--color-primary); color: var(--color-surface); font-size: 28px; font-weight: 700; }
.profile-summary__eyebrow { font-size: var(--font-size-caption); }
.profile-summary__identity h2 { margin-top: var(--space-1); font-size: 22px; }
.profile-basic { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
.profile-basic div { padding-left: var(--space-4); border-left: 1px solid var(--color-border); }
.profile-basic dt, .role-list dt { color: var(--color-muted); font-size: var(--font-size-caption); }
.profile-basic dd, .role-list dd { margin: var(--space-1) 0 0; color: var(--color-text); font-weight: 600; }
.profile-access { display: grid; gap: var(--space-4); }
.profile-card { overflow: hidden; }
.profile-card > header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-border); }
.profile-card > header h2 { font-size: var(--font-size-section); }
.profile-card > header > span { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 50%; background: var(--color-page); color: var(--color-primary); font-weight: 700; }
.role-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); padding: var(--space-4) var(--space-6); }
.role-list__item { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.profile-list__icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: var(--radius-control); background: var(--color-page); color: var(--color-primary); font-weight: 700; }
.role-list dl { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: var(--space-4); }
.role-list code, .permission-item code { white-space: normal; overflow-wrap: anywhere; color: var(--color-primary); font-family: var(--font-sans); }
.permission-header { border-bottom: 0 !important; }
.permission-content { padding: 0 var(--space-6) var(--space-6); }
.permission-search { display: flex; min-height: 42px; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.permission-search .app-icon { width: 18px; color: var(--color-muted); }
.permission-search input { width: 100%; border: 0; outline: 0; }
.permission-groups { display: grid; gap: var(--space-3); margin-top: var(--space-4); }
.permission-group { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.permission-group__toggle { display: flex; width: 100%; min-height: 58px; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--color-page); color: var(--color-text); text-align: left; }
.permission-group__toggle > span { display: flex; align-items: baseline; gap: var(--space-3); }
.permission-group__toggle small { color: var(--color-muted); }
.permission-group__toggle .app-icon { width: 16px; color: var(--color-muted); transition: transform 160ms ease; }
.permission-group__toggle[aria-expanded="true"] .app-icon { transform: rotate(180deg); }
.permission-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 220ms ease; }
.permission-collapse--open { grid-template-rows: 1fr; }
.permission-collapse__inner { min-height: 0; overflow: hidden; }
.permission-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--color-border); opacity: 0; transform: translateY(-6px); transition: opacity 180ms ease, transform 220ms ease; }
.permission-collapse--open .permission-list { opacity: 1; transform: translateY(0); }
.permission-item { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: var(--space-3); min-height: 76px; padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); }
.permission-item:nth-child(odd) { border-right: 1px solid var(--color-border); }
.permission-item div:last-child { display: grid; gap: var(--space-1); min-width: 0; }
.permission-item code { font-size: var(--font-size-caption); }
.profile-loading, .profile-error, .profile-empty { padding: var(--space-6); color: var(--color-muted); }
.profile-error { display: flex; justify-content: space-between; gap: var(--space-4); color: var(--color-text); }
.profile-error button { background: transparent; color: var(--color-primary); font-weight: 600; }
@media (prefers-reduced-motion: reduce) {
  .permission-collapse, .permission-list, .permission-group__toggle .app-icon { transition: none; }
}
@media (max-width: 860px) {
  .profile-summary { grid-template-columns: auto 1fr; }
  .profile-basic { grid-column: 1 / -1; }
  .permission-list { grid-template-columns: 1fr; }
  .permission-item:nth-child(odd) { border-right: 0; }
}
@media (max-width: 560px) {
  .profile-heading { align-items: stretch; flex-direction: column; }
  .profile-summary { grid-template-columns: 1fr; text-align: center; }
  .profile-avatar { margin: 0 auto; }
  .profile-basic { grid-template-columns: 1fr; text-align: left; }
  .role-list { grid-template-columns: 1fr; padding: var(--space-4); }
  .role-list dl { grid-template-columns: 1fr; }
  .permission-content { padding: 0 var(--space-4) var(--space-4); }
  .permission-group__toggle > span { align-items: flex-start; flex-direction: column; gap: var(--space-1); }
}
</style>
