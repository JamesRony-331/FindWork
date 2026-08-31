<script setup>
import ManagementTable from '../../components/ManagementTable.vue'

const columns = [
  { key: 'name', label: '菜单名称' }, { key: 'type', label: '菜单类型' },
  { key: 'path', label: '路由地址' }, { key: 'permission', label: '权限标识' },
  { key: 'sort', label: '排序' }, { key: 'status', label: '状态' },
]
const fields = [
  { key: 'name', label: '菜单名称', placeholder: '请输入菜单名称', required: true },
  { key: 'type', label: '菜单类型', type: 'select', defaultValue: '菜单', options: [{ label: '目录', value: '目录' }, { label: '菜单', value: '菜单' }] },
  { key: 'path', label: '路由地址', placeholder: '例如 /system/menu' },
  { key: 'permission', label: '权限标识', placeholder: '例如 system:menu:list' },
  { key: 'sort', label: '显示排序', placeholder: '请输入排序数字', defaultValue: '0' },
  { key: 'status', label: '状态', type: 'select', defaultValue: 'enabled', options: [{ label: '启用', value: 'enabled' }, { label: '停用', value: 'disabled' }] },
]
const rows = [
  { id: 1, name: '系统管理', type: '目录', path: '/system', permission: '—', sort: 10, status: 'enabled' },
  { id: 2, name: '　菜单管理', type: '菜单', path: '/system/menu', permission: 'system:menu:list', sort: 1, status: 'enabled' },
  { id: 3, name: '　角色管理', type: '菜单', path: '/system/role', permission: 'system:role:list', sort: 2, status: 'enabled' },
  { id: 4, name: '　权限管理', type: '菜单', path: '/system/permission', permission: 'system:permission:list', sort: 3, status: 'enabled' },
]
</script>

<template>
  <ManagementTable title="菜单管理" description="维护管理端目录、页面路由与权限标识，为后端动态菜单提供结构参考。" add-label="新增菜单" search-placeholder="搜索菜单名称、路由地址或权限标识" :columns="columns" :fields="fields" :rows="rows" />
  <!-- 静态阶段保留新增、编辑、删除操作，后续接入菜单接口。 -->
</template>
