<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  label: { type: String, required: true },
})

const statusClass = computed(() => ({
  failed: 'danger',
  running: 'info',
}[props.status] ?? props.status))
</script>

<template>
  <span class="status" :class="`status--${statusClass}`" :aria-label="`状态：${label}`">
    <span class="status-tag__dot" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>

<style scoped>
.status-tag__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
