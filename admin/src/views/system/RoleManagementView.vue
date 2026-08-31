<script setup>
import ManagementTable from '../../components/ManagementTable.vue'

const columns = [
  { key: 'name', label: '角色名称' }, { key: 'code', label: '角色编码' },
  { key: 'permissions', label: '关联权限' }, { key: 'users', label: '用户数' },
  { key: 'status', label: '状态' }, { key: 'createdAt', label: '创建时间' },
]
const fields = [
  { key: 'name', label: '角色名称', placeholder: '请输入角色名称', required: true },
  { key: 'code', label: '角色编码', placeholder: '例如 super_admin', required: true },
  { key: 'permissions', label: '关联权限', placeholder: '例如 *:*:*' },
  { key: 'users', label: '用户数', placeholder: '请输入用户数', defaultValue: '0' },
  { key: 'createdAt', label: '创建时间', placeholder: 'YYYY-MM-DD', defaultValue: '2026-08-31' },
  { key: 'status', label: '状态', type: 'select', defaultValue: 'enabled', options: [{ label: '启用', value: 'enabled' }, { label: '停用', value: 'disabled' }] },
]
const rows = [
  { id: 1, name: '超级管理员', code: 'super_admin', permissions: '*:*:*', users: 1, status: 'enabled', createdAt: '2026-08-31' },
  { id: 2, name: '数据运营员', code: 'data_operator', permissions: 'data:*:list', users: 3, status: 'enabled', createdAt: '2026-08-20' },
  { id: 3, name: '只读访客', code: 'viewer', permissions: '*:*:list', users: 6, status: 'disabled', createdAt: '2026-08-16' },
]
</script>

<template>
  <ManagementTable title="角色管理" description="配置后台角色及其关联权限范围，当前内容为静态演示数据。" add-label="新增角色" search-placeholder="搜索角色名称、角色编码或关联权限" :columns="columns" :fields="fields" :rows="rows" />
  <!-- 静态阶段保留新增、编辑、删除操作，后续接入角色接口。 -->
</template>
