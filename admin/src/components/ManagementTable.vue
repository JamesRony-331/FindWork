<script setup>
import { computed, reactive, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  addLabel: { type: String, required: true },
  searchPlaceholder: { type: String, required: true },
  columns: { type: Array, required: true },
  fields: { type: Array, required: true },
  rows: { type: Array, required: true },
  primaryField: { type: String, default: 'name' },
})

const searchKeyword = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = 5
const editorOpen = ref(false)
const deleteOpen = ref(false)
const editingId = ref(null)
const pendingDeleteId = ref(null)
const records = ref(props.rows.map((row) => ({ ...row })))
const form = reactive({})

const filteredRows = computed(() => records.value.filter((row) => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  const matchesKeyword = !keyword || Object.values(row).some((value) => String(value).toLowerCase().includes(keyword))
  const matchesStatus = statusFilter.value === 'all' || row.status === statusFilter.value
  return matchesKeyword && matchesStatus
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))
const pagedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
const editingRecord = computed(() => records.value.find((row) => row.id === editingId.value))
const deleteRecord = computed(() => records.value.find((row) => row.id === pendingDeleteId.value))

watch([searchKeyword, statusFilter], () => { currentPage.value = 1 })
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages })

function resetForm(row = {}) {
  for (const field of props.fields) form[field.key] = row[field.key] ?? field.defaultValue ?? ''
}

function openCreate() {
  editingId.value = null
  resetForm()
  editorOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  resetForm(row)
  editorOpen.value = true
}

function saveRecord() {
  const payload = Object.fromEntries(props.fields.map((field) => [field.key, form[field.key]]))
  if (editingId.value === null) {
    const nextId = Math.max(0, ...records.value.map((row) => Number(row.id) || 0)) + 1
    records.value.unshift({ id: nextId, ...payload, status: payload.status || 'enabled' })
  } else {
    const index = records.value.findIndex((row) => row.id === editingId.value)
    if (index >= 0) records.value[index] = { ...records.value[index], ...payload }
  }
  editorOpen.value = false
}

function askDelete(row) {
  pendingDeleteId.value = row.id
  deleteOpen.value = true
}

function deleteRecordNow() {
  records.value = records.value.filter((row) => row.id !== pendingDeleteId.value)
  deleteOpen.value = false
  pendingDeleteId.value = null
}

function displayValue(row, column) {
  if (column.key === 'status') return row.status === 'enabled' ? '启用' : '停用'
  return row[column.key] || '—'
}
</script>

<template>
  <section class="management-page">
    <header class="management-page__header">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
      <button class="button" type="button" @click="openCreate">
        <span aria-hidden="true">＋</span>{{ addLabel }}
      </button>
    </header>

    <div class="management-toolbar panel">
      <label class="management-search">
        <span class="sr-only">搜索关键词</span>
        <AppIcon name="search" />
        <input v-model="searchKeyword" type="search" :placeholder="searchPlaceholder" />
      </label>
      <label class="management-status">
        <span>状态</span>
        <select v-model="statusFilter">
          <option value="all">全部状态</option>
          <option value="enabled">启用</option>
          <option value="disabled">停用</option>
        </select>
      </label>
      <span class="management-toolbar__count">共 {{ filteredRows.length }} 条记录</span>
    </div>

    <div class="management-table-wrap panel">
      <div class="management-table-scroll">
        <table class="management-table">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedRows" :key="row.id">
              <td v-for="column in columns" :key="column.key">
                <span v-if="column.key === 'status'" class="status" :class="row.status === 'enabled' ? 'status--success' : 'status--warning'">
                  {{ displayValue(row, column) }}
                </span>
                <strong v-else-if="column.key === primaryField" class="management-table__primary">{{ displayValue(row, column) }}</strong>
                <span v-else>{{ displayValue(row, column) }}</span>
              </td>
              <td>
                <div class="management-table__actions">
                  <button type="button" @click="openEdit(row)">编辑</button>
                  <button class="management-table__delete" type="button" @click="askDelete(row)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedRows.length === 0">
              <td class="management-table__empty" :colspan="columns.length + 1">没有符合条件的数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="management-pagination">
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
        <div>
          <button class="button button--secondary" type="button" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
          <button class="button button--secondary" type="button" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
        </div>
      </footer>
    </div>

    <Teleport to="body">
      <div v-if="editorOpen" class="management-dialog-backdrop" @click.self="editorOpen = false">
        <section class="management-dialog panel" role="dialog" aria-modal="true" :aria-label="editingId === null ? addLabel : `编辑${title}`">
          <header>
            <h2>{{ editingId === null ? addLabel : `编辑${title.replace('管理', '')}` }}</h2>
            <button type="button" aria-label="关闭弹窗" @click="editorOpen = false">×</button>
          </header>
          <form @submit.prevent="saveRecord">
            <label v-for="field in fields" :key="field.key" class="field">
              <span class="field__label">{{ field.label }}</span>
              <select v-if="field.type === 'select'" v-model="form[field.key]" class="field__control">
                <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <input v-else v-model="form[field.key]" class="field__control" :placeholder="field.placeholder" :required="field.required" />
            </label>
            <footer>
              <button class="button button--secondary" type="button" @click="editorOpen = false">取消</button>
              <button class="button" type="submit">保存</button>
            </footer>
          </form>
        </section>
      </div>
    </Teleport>

    <ConfirmDialog
      :open="deleteOpen"
      title="确认删除"
      :message="`确定删除“${deleteRecord?.[primaryField] || '该记录'}”吗？此操作仅影响当前静态演示数据。`"
      @cancel="deleteOpen = false"
      @confirm="deleteRecordNow"
    />
  </section>
</template>

<style scoped>
.management-page { display: grid; gap: var(--space-4); }
.management-page__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) 0; }
.management-page__header h1 { font-size: var(--font-size-title); }
.management-page__header p { margin-top: var(--space-2); color: var(--color-muted); }
.management-toolbar { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); }
.management-search { display: flex; width: min(100%, 360px); min-height: 40px; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-control); background: var(--color-surface); }
.management-search .app-icon { width: 18px; color: var(--color-muted); }
.management-search input { width: 100%; border: 0; outline: 0; }
.management-status { display: flex; align-items: center; gap: var(--space-2); color: var(--color-muted); }
.management-status select { min-height: 40px; padding: 0 var(--space-3); }
.management-toolbar__count { margin-left: auto; color: var(--color-muted); }
.management-table-wrap { overflow: hidden; }
.management-table-scroll { overflow-x: auto; }
.management-table { width: 100%; min-width: 880px; }
.management-table th, .management-table td { padding: 14px var(--space-4); border-bottom: 1px solid var(--color-border); text-align: left; white-space: nowrap; }
.management-table th { background: var(--color-page); color: var(--color-muted); font-size: var(--font-size-caption); font-weight: 600; }
.management-table__primary { color: var(--color-text); font-weight: 600; }
.management-table__actions { display: flex; gap: var(--space-3); }
.management-table__actions button { padding: 0; background: transparent; color: var(--color-primary); }
.management-table__actions .management-table__delete { color: var(--color-danger); }
.management-table__empty { padding: 48px !important; color: var(--color-muted); text-align: center !important; }
.management-pagination { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); color: var(--color-muted); }
.management-pagination div { display: flex; gap: var(--space-2); }
.management-dialog-backdrop { position: fixed; z-index: 30; inset: 0; display: grid; place-items: center; padding: var(--space-4); background: var(--color-nav); }
.management-dialog { width: min(100%, 520px); padding: var(--space-6); }
.management-dialog > header, .management-dialog form > footer { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.management-dialog > header button { background: transparent; color: var(--color-muted); font-size: 26px; }
.management-dialog form { display: grid; gap: var(--space-4); margin-top: var(--space-5); }
.management-dialog form > footer { justify-content: flex-end; margin-top: var(--space-2); }
@media (max-width: 720px) {
  .management-page__header, .management-toolbar { align-items: stretch; flex-direction: column; }
  .management-search { width: 100%; }
  .management-toolbar__count { margin-left: 0; }
  .management-pagination { align-items: flex-start; flex-direction: column; gap: var(--space-3); }
}
</style>
