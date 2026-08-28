<script setup>
import { computed } from 'vue'
const props = defineProps({ page: { type: Number, default: 1 }, pageSize: { type: Number, default: 10 }, total: { type: Number, default: 0 } })
const emit = defineEmits(['change'])
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const pages = computed(() => Array.from({ length: Math.min(pageCount.value, 5) }, (_, i) => i + 1))
</script>
<template><div class="pagination"><span>共 {{ total }} 条</span><div class="pagination-pages"><button class="button" :disabled="page <= 1" @click="emit('change', page - 1)">上一页</button><button v-for="item in pages" :key="item" class="page-button" :class="{ active: item === page }" @click="emit('change', item)">{{ item }}</button><button class="button" :disabled="page >= pageCount" @click="emit('change', page + 1)">下一页</button></div></div></template>
<style scoped>.pagination{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 2px;color:var(--color-text-secondary)}.pagination-pages{display:flex;gap:6px}.page-button{min-width:36px;height:36px;border:1px solid var(--color-border);border-radius:6px;background:#fff}.page-button.active{color:#fff;border-color:var(--color-accent);background:var(--color-accent)}@media(max-width:560px){.pagination{align-items:flex-start;flex-direction:column}.pagination-pages{width:100%;overflow-x:auto}}</style>
