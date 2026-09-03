<script setup>
import { computed } from 'vue'
import { nodeSelectionState } from '../utils/permissionTree.js'

const props = defineProps({
  node: { type: Object, required: true },
  selectedIds: { type: Array, required: true },
  expandedKeys: { type: Array, required: true },
})
const emit = defineEmits(['toggle-node', 'toggle-expanded'])
const hasChildren = computed(() => Boolean(props.node.children?.length))
const selectionState = computed(() => nodeSelectionState(props.node, props.selectedIds))
const expanded = computed(() => props.expandedKeys.includes(props.node.key))
</script>

<template>
  <li class="permission-tree-node">
    <div class="permission-tree-node__row">
      <button v-if="hasChildren" class="permission-tree-node__expand" type="button" :aria-label="`${expanded ? '收起' : '展开'}${node.label}`" :aria-expanded="expanded" @click="emit('toggle-expanded', node.key)">
        <span :class="{ 'permission-tree-node__arrow--open': expanded }" aria-hidden="true">›</span>
      </button>
      <span v-else class="permission-tree-node__indent" aria-hidden="true"></span>
      <label>
        <input type="checkbox" :checked="selectionState === 'checked'" :indeterminate="selectionState === 'mixed'" @change="emit('toggle-node', node)" />
        <span>{{ node.label }}</span>
        <code v-if="node.permissionId != null">{{ node.code }}</code>
      </label>
    </div>
    <ul v-if="hasChildren" v-show="expanded" class="permission-tree-node__children">
      <PermissionTreeNode v-for="child in node.children" :key="child.key" :node="child" :selected-ids="selectedIds" :expanded-keys="expandedKeys" @toggle-node="emit('toggle-node', $event)" @toggle-expanded="emit('toggle-expanded', $event)" />
    </ul>
  </li>
</template>

<style scoped>
.permission-tree-node { list-style: none; }
.permission-tree-node__row { display: flex; min-height: 38px; align-items: center; gap: var(--space-1); border-radius: var(--radius-control); }
.permission-tree-node__row:hover { background: var(--color-page); }
.permission-tree-node__expand, .permission-tree-node__indent { display: grid; width: 28px; height: 28px; flex: 0 0 auto; place-items: center; background: transparent; color: var(--color-muted); }
.permission-tree-node__expand span { display: block; font-size: 22px; transition: transform 160ms ease; }
.permission-tree-node__expand .permission-tree-node__arrow--open { transform: rotate(90deg); }
.permission-tree-node__row label { display: flex; min-width: 0; flex: 1; align-items: center; gap: var(--space-2); cursor: pointer; }
.permission-tree-node__row input { width: 17px; height: 17px; accent-color: var(--color-primary); }
.permission-tree-node__row code { margin-left: auto; padding-right: var(--space-3); color: var(--color-muted); font-size: var(--font-size-caption); }
.permission-tree-node__children { margin: 0 0 0 18px; padding-left: 12px; border-left: 1px solid var(--color-border); }
@media (prefers-reduced-motion: reduce) { .permission-tree-node__expand span { transition: none; } }
</style>
