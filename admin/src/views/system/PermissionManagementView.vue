<script setup>
import { onMounted, ref } from 'vue'
import ManagementTable from '../../components/ManagementTable.vue'
import { getRequestErrorMessage, getUserPermissions, insertPermission, updatePermission } from '../../api/admin.js'
import { toPermissionPayload, toPermissionRows } from '../../utils/permissionManagement.js'

const columns = [
  { key: 'name', label: '权限名称' }, { key: 'code', label: '权限编码' },
]
const fields = [
  { key: 'name', label: '权限名称', placeholder: '请输入权限名称', required: true },
  { key: 'code', label: '权限编码', placeholder: '例如 system:menu:list', required: true },
]

const rows = ref([])
const isLoading = ref(true)
const loadError = ref('')

onMounted(loadPermissions)

async function loadPermissions() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await getUserPermissions()
    if (response.code !== 200) throw new Error(response.info || '权限加载失败')
    rows.value = toPermissionRows(response.data)
  } catch (error) {
    rows.value = []
    loadError.value = getRequestErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

async function savePermission(record) {
  const payload = toPermissionPayload(record)
  const response = record.id == null
    ? await insertPermission(payload)
    : await updatePermission(payload)
  if (response.code !== 200) throw new Error(response.info || '权限保存失败')
  await loadPermissions()
}
</script>

<template>
  <div v-if="isLoading" class="permission-state" aria-live="polite">正在加载权限…</div>
  <div v-else-if="loadError" class="permission-state permission-state--error" role="alert">
    <span>{{ loadError }}</span>
    <button class="button button--secondary" type="button" @click="loadPermissions">重新加载</button>
  </div>
  <ManagementTable
    v-else
    title="权限管理"
    description="维护管理端权限名称与权限编码。"
    add-label="新增权限"
    search-placeholder="搜索权限名称或权限编码"
    :columns="columns"
    :fields="fields"
    :rows="rows"
    :deletable="false"
    :show-status-filter="false"
    :save-handler="savePermission"
  />
</template>

<style scoped>
.permission-state { display: flex; min-height: 180px; align-items: center; justify-content: center; gap: var(--space-3); color: var(--color-muted); }
.permission-state--error { color: var(--color-danger); }
</style>
