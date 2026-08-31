<script setup>
import ManagementTable from '../../components/ManagementTable.vue'

const columns = [
  { key: 'name', label: '权限名称' }, { key: 'code', label: '权限编码' },
  { key: 'roles', label: '关联角色' }, { key: 'scope', label: '作用范围' },
  { key: 'status', label: '状态' }, { key: 'createdAt', label: '创建时间' },
]
const fields = [
  { key: 'name', label: '权限名称', placeholder: '请输入权限名称', required: true },
  { key: 'code', label: '权限编码', placeholder: '例如 system:menu:list', required: true },
  { key: 'roles', label: '关联角色', placeholder: '请输入角色名称' },
  { key: 'scope', label: '作用范围', placeholder: '请输入权限作用范围' },
  { key: 'createdAt', label: '创建时间', placeholder: 'YYYY-MM-DD', defaultValue: '2026-08-31' },
  { key: 'status', label: '状态', type: 'select', defaultValue: 'enabled', options: [{ label: '启用', value: 'enabled' }, { label: '停用', value: 'disabled' }] },
]
const rows = [
  { id: 1, name: '超级管理员权限', code: '*:*:*', roles: '超级管理员', scope: '全部资源', status: 'enabled', createdAt: '2026-08-31' },
  { id: 2, name: '菜单查询', code: 'system:menu:list', roles: '超级管理员', scope: '菜单管理', status: 'enabled', createdAt: '2026-08-31' },
  { id: 3, name: '角色查询', code: 'system:role:list', roles: '超级管理员', scope: '角色管理', status: 'enabled', createdAt: '2026-08-31' },
  { id: 4, name: '权限查询', code: 'system:permission:list', roles: '超级管理员', scope: '权限管理', status: 'enabled', createdAt: '2026-08-31' },
]
</script>

<template>
  <ManagementTable title="权限管理" description="维护权限编码及角色关联关系，超级管理员拥有全局通配权限。" add-label="新增权限" search-placeholder="搜索权限名称、权限编码或关联角色" :columns="columns" :fields="fields" :rows="rows" />
  <!-- 静态阶段保留新增、编辑、删除操作，后续接入权限接口。 -->
</template>
