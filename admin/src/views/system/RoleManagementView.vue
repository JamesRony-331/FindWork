<script setup>
import { onMounted, ref } from 'vue'
import { getRequestErrorMessage, getRoleList, insertRole, updateRole } from '../../api/admin.js'
import ManagementTable from '../../components/ManagementTable.vue'
import PermissionTreeEditor from '../../components/PermissionTreeEditor.vue'

const columns = [
  { key: 'name', label: '角色名称' },
  { key: 'code', label: '角色编码' },
  { key: 'permissionSummary', label: '关联权限' },
]
const fields = [
  { key: 'name', label: '角色名称', placeholder: '请输入角色名称', required: true },
  { key: 'code', label: '角色编码', placeholder: '例如 super_admin', required: true },
  { key: 'permissions', label: '关联权限', defaultValue: [] },
]
const rows = ref([])
const loading = ref(true)
const loadError = ref('')

onMounted(loadRoles)

async function loadRoles() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await getRoleList()
    if (response.code !== 200) throw new Error(response.info || '角色加载失败')
    rows.value = (response.data || []).map((role) => ({
      id: role.id,
      name: role.roleName,
      code: role.roleCode,
      permissionSummary: '点击编辑查看',
      permissions: [],
    }))
  } catch (error) {
    rows.value = []
    loadError.value = getRequestErrorMessage(error)
  } finally {
    loading.value = false
  }
}

async function saveRole(record) {
  const payload = { roleName: record.name.trim(), roleCode: record.code.trim() }
  const response = record.id == null
    ? await insertRole(payload)
    : await updateRole({ id: record.id, ...payload, permissionIds: record.permissions })
  if (response.code !== 200) throw new Error(response.info || '角色保存失败')
  await loadRoles()
}
</script>

<template>
  <div v-if="loading" class="role-state" aria-live="polite">正在加载角色…</div>
  <div v-else-if="loadError" class="role-state role-state--error" role="alert">
    <span>{{ loadError }}</span>
    <button class="button button--secondary" type="button" @click="loadRoles">重新加载</button>
  </div>
  <ManagementTable
    v-else
    title="角色管理"
    description="配置后台角色及其关联权限。"
    add-label="新增角色"
    search-placeholder="搜索角色名称或角色编码"
    :columns="columns"
    :fields="fields"
    :rows="rows"
    :deletable="false"
    :show-status-filter="false"
    :dialog-wide="true"
    :save-handler="saveRole"
  >
    <template #field-permissions="{ form, editingId }">
      <PermissionTreeEditor v-if="editingId != null" v-model="form.permissions" :role-id="editingId" />
      <p v-else class="role-permission-hint">创建角色后，可在编辑角色时配置权限。</p>
    </template>
  </ManagementTable>
</template>

<style scoped>
.role-state { display: flex; min-height: 180px; align-items: center; justify-content: center; gap: var(--space-3); color: var(--color-muted); }
.role-state--error { color: var(--color-danger); }
.role-permission-hint { padding: var(--space-3); border: 1px dashed var(--color-border); border-radius: var(--radius-control); color: var(--color-muted); }
</style>
