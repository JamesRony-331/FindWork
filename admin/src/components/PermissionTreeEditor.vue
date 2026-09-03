<script setup>
import { computed, ref, watch } from 'vue'
import { getPermissionTree, getRequestErrorMessage } from '../api/admin.js'
import { collectNodeKeys, collectPermissionIds, initialSelectedIds, toggleNodeSelection } from '../utils/permissionTree.js'
import PermissionTreeNode from './PermissionTreeNode.vue'

const props = defineProps({ roleId: { type: Number, required: true }, modelValue: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])
const tree = ref([])
const expandedKeys = ref([])
const loading = ref(true)
const error = ref('')
const allPermissionIds = computed(() => collectPermissionIds(tree.value))
const allSelected = computed(() => allPermissionIds.value.length > 0 && allPermissionIds.value.every((id) => props.modelValue.includes(id)))

watch(() => props.roleId, loadTree, { immediate: true })

async function loadTree() {
  loading.value = true
  error.value = ''
  try {
    const response = await getPermissionTree(props.roleId)
    if (response.code !== 200) throw new Error(response.info || '权限树加载失败')
    tree.value = response.data || []
    expandedKeys.value = tree.value.map((node) => node.key)
    emit('update:modelValue', initialSelectedIds(tree.value))
  } catch (loadError) {
    tree.value = []
    error.value = getRequestErrorMessage(loadError)
  } finally {
    loading.value = false
  }
}

function toggleNode(node) { emit('update:modelValue', toggleNodeSelection(props.modelValue, node)) }
function toggleExpanded(key) {
  const expanded = new Set(expandedKeys.value)
  expanded.has(key) ? expanded.delete(key) : expanded.add(key)
  expandedKeys.value = [...expanded]
}
function toggleAll() { emit('update:modelValue', allSelected.value ? [] : allPermissionIds.value) }
</script>

<template>
  <section class="permission-tree-editor" aria-label="角色权限树">
    <div class="permission-tree-editor__toolbar">
      <button type="button" @click="expandedKeys = collectNodeKeys(tree)">展开全部</button>
      <button type="button" @click="expandedKeys = []">收起全部</button>
      <button type="button" @click="toggleAll">{{ allSelected ? '全不选' : '全选' }}</button>
      <span>已选择 {{ modelValue.length }} 项</span>
    </div>
    <p v-if="loading" class="permission-tree-editor__state">正在加载权限树…</p>
    <div v-else-if="error" class="permission-tree-editor__state permission-tree-editor__state--error" role="alert">
      <span>{{ error }}</span><button type="button" @click="loadTree">重新加载</button>
    </div>
    <ul v-else class="permission-tree-editor__tree">
      <PermissionTreeNode v-for="node in tree" :key="node.key" :node="node" :selected-ids="modelValue" :expanded-keys="expandedKeys" @toggle-node="toggleNode" @toggle-expanded="toggleExpanded" />
    </ul>
  </section>
</template>

<style scoped>
.permission-tree-editor { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.permission-tree-editor__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--color-border); background: var(--color-page); }
.permission-tree-editor__toolbar button { padding: 0; background: transparent; color: var(--color-primary); }
.permission-tree-editor__toolbar span { margin-left: auto; color: var(--color-muted); font-size: var(--font-size-caption); }
.permission-tree-editor__tree { max-height: 330px; overflow: auto; margin: 0; padding: var(--space-3); }
.permission-tree-editor__state { display: flex; min-height: 120px; align-items: center; justify-content: center; gap: var(--space-2); color: var(--color-muted); }
.permission-tree-editor__state--error { color: var(--color-danger); }
</style>
