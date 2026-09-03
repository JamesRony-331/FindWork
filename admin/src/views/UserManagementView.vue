<script setup>
import { onMounted, ref } from 'vue'
import { getRequestErrorMessage, getUsersByPage } from '../api/admin.js'
import { formatUserDate, formatUserSex, formatUserStatus, normalizeUserPage } from '../utils/userPagination.js'

const rows = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const totalCount = ref(0)
const isLoading = ref(true)
const loadError = ref('')

onMounted(() => loadUsers(1))

async function loadUsers(targetPage) {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await getUsersByPage({ pageNum: targetPage, pageSize: pageSize.value })
    if (response.code !== 200) throw new Error(response.info || '用户加载失败')
    const page = normalizeUserPage(response.data)
    rows.value = page.rows
    pageNum.value = page.pageNum
    pageSize.value = page.pageSize
    totalPages.value = page.totalPages
    totalCount.value = page.totalCount
  } catch (error) {
    rows.value = []
    loadError.value = getRequestErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

function changePageSize() {
  loadUsers(1)
}
</script>

<template>
  <section class="user-page">
    <header class="user-page__header">
      <div>
        <h1>用户管理</h1>
        <p>查看系统注册用户及账号状态。</p>
      </div>
      <span class="user-page__total">共 <strong>{{ totalCount }}</strong> 位用户</span>
    </header>

    <div class="user-toolbar panel">
      <div>
        <strong>用户列表</strong>
        <span>数据来自后端分页接口</span>
      </div>
      <label>
        <span>每页显示</span>
        <select v-model.number="pageSize" @change="changePageSize">
          <option :value="10">10 条</option>
          <option :value="20">20 条</option>
          <option :value="50">50 条</option>
        </select>
      </label>
    </div>

    <div class="user-table-wrap panel">
      <div v-if="isLoading" class="user-state" aria-live="polite">正在加载用户…</div>
      <div v-else-if="loadError" class="user-state user-state--error" role="alert">
        <span>{{ loadError }}</span>
        <button class="button button--secondary" type="button" @click="loadUsers(pageNum)">重新加载</button>
      </div>
      <div v-else class="user-table-scroll">
        <table class="user-table">
          <thead>
            <tr><th>用户</th><th>邮箱</th><th>性别</th><th>注册时间</th><th>状态</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.uuid">
              <td>
                <div class="user-identity">
                  <span aria-hidden="true">{{ (row.nickname || row.email || '用').slice(0, 1).toUpperCase() }}</span>
                  <div><strong>{{ row.nickname || '未设置昵称' }}</strong><small>{{ row.uuid }}</small></div>
                </div>
              </td>
              <td>{{ row.email || '—' }}</td>
              <td>{{ formatUserSex(row.sex) }}</td>
              <td>{{ formatUserDate(row.createTime) }}</td>
              <td><span class="status" :class="Number(row.isDelete) === 1 ? 'status--warning' : 'status--success'">{{ formatUserStatus(row.isDelete) }}</span></td>
            </tr>
            <tr v-if="rows.length === 0"><td class="user-table__empty" colspan="5">暂无用户数据</td></tr>
          </tbody>
        </table>
      </div>
      <footer v-if="!isLoading && !loadError" class="user-pagination">
        <span>第 {{ pageNum }} / {{ totalPages }} 页</span>
        <div>
          <button class="button button--secondary" type="button" :disabled="pageNum <= 1" @click="loadUsers(pageNum - 1)">上一页</button>
          <button class="button button--secondary" type="button" :disabled="pageNum >= totalPages" @click="loadUsers(pageNum + 1)">下一页</button>
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.user-page { display: grid; gap: var(--space-4); }
.user-page__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) 0; }
.user-page__header h1 { font-size: var(--font-size-title); }
.user-page__header p { margin-top: var(--space-2); color: var(--color-muted); }
.user-page__total { padding: 10px 14px; border-radius: 999px; background: var(--color-primary-soft); color: var(--color-primary); }
.user-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-4); }
.user-toolbar > div { display: grid; gap: 4px; }
.user-toolbar > div span, .user-toolbar label { color: var(--color-muted); font-size: var(--font-size-caption); }
.user-toolbar label { display: flex; align-items: center; gap: var(--space-2); }
.user-toolbar select { min-height: 38px; padding: 0 var(--space-3); }
.user-table-wrap { overflow: hidden; }
.user-table-scroll { overflow-x: auto; }
.user-table { width: 100%; min-width: 900px; }
.user-table th, .user-table td { padding: 14px var(--space-4); border-bottom: 1px solid var(--color-border); text-align: left; white-space: nowrap; }
.user-table th { background: var(--color-page); color: var(--color-muted); font-size: var(--font-size-caption); font-weight: 600; }
.user-identity { display: flex; align-items: center; gap: var(--space-3); }
.user-identity > span { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; background: var(--color-primary-soft); color: var(--color-primary); font-weight: 700; }
.user-identity div { display: grid; gap: 3px; }
.user-identity small { max-width: 220px; overflow: hidden; color: var(--color-muted); text-overflow: ellipsis; }
.user-state { display: flex; min-height: 220px; align-items: center; justify-content: center; gap: var(--space-3); color: var(--color-muted); }
.user-state--error { color: var(--color-danger); }
.user-table__empty { height: 180px; color: var(--color-muted); text-align: center !important; }
.user-pagination { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); color: var(--color-muted); }
.user-pagination div { display: flex; gap: var(--space-2); }
@media (max-width: 720px) {
  .user-page__header, .user-toolbar, .user-pagination { align-items: stretch; flex-direction: column; }
  .user-toolbar label { justify-content: space-between; }
}
</style>
