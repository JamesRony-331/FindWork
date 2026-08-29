<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  valueLabel: { type: String, default: '岗位数' },
});
</script>
<template>
  <ol class="ranking-list">
    <li v-for="(item, index) in items" :key="item.name">
      <span class="rank">{{ index + 1 }}</span>
      <span class="name">{{ item.name }}</span>
      <span class="bar">
        <i :style="{ width: `${Math.max(12, (item.value / items[0].value) * 100)}%` }" />
      </span>
      <strong>{{ item.value.toLocaleString() }}</strong>
    </li>
  </ol>
</template>
<style scoped>
.ranking-list {
  padding: 4px 0;
}
.ranking-list li {
  display: grid;
  grid-template-columns: 28px minmax(110px, 1fr) minmax(80px, 1.5fr) 72px;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-bottom: 1px solid var(--color-border);
}
.ranking-list li:last-child {
  border-bottom: 0;
}
.rank {
  color: var(--color-text-muted);
}
.name {
  color: var(--color-text);
}
.bar {
  height: 6px;
  background: #edf3f5;
}
.bar i {
  display: block;
  height: 100%;
  background: var(--color-accent);
}
strong {
  text-align: right;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
