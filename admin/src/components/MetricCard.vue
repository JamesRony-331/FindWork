<script setup>
import { computed } from 'vue'

const props = defineProps({
  metric: { type: Object, required: true },
})

const formattedValue = computed(() => new Intl.NumberFormat('zh-CN').format(props.metric.value ?? 0))
const changeClass = computed(() => Number(props.metric.change) < 0 ? 'metric-card__change--down' : 'metric-card__change--up')
</script>

<template>
  <article class="metric-card panel" :aria-label="`${metric.label}：${formattedValue}${metric.unit ?? ''}`">
    <p class="metric-card__label">{{ metric.label }}</p>
    <p class="metric-card__value">
      {{ formattedValue }}<span v-if="metric.unit" class="metric-card__unit">{{ metric.unit }}</span>
    </p>
    <p class="metric-card__change" :class="changeClass">
      <span aria-hidden="true">{{ Number(metric.change) < 0 ? '↓' : '↑' }}</span>
      {{ Math.abs(Number(metric.change) || 0) }}% {{ metric.changeLabel }}
    </p>
  </article>
</template>

<style scoped>
.metric-card {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-5);
}

.metric-card__label {
  color: var(--color-muted);
  font-size: var(--font-size-body);
}

.metric-card__value {
  color: var(--color-text);
  font-size: var(--font-size-metric);
  font-weight: 700;
  line-height: 1.2;
}

.metric-card__unit {
  margin-left: var(--space-1);
  color: var(--color-muted);
  font-size: var(--font-size-body);
  font-weight: 600;
}

.metric-card__change {
  font-size: var(--font-size-caption);
  font-weight: 600;
}

.metric-card__change--up {
  color: var(--color-success);
}

.metric-card__change--down {
  color: var(--color-danger);
}
</style>
