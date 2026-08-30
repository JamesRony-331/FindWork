<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  metric: { type: Object, required: true },
})

const formattedValue = computed(() => new Intl.NumberFormat('zh-CN').format(props.metric.value ?? 0))
const changeClass = computed(() => Number(props.metric.change) < 0 ? 'metric-card__change--down' : 'metric-card__change--up')
const metricPresentation = computed(() => ({
  'job-count': { icon: 'briefcase', tone: 'primary' },
  'user-count': { icon: 'user', tone: 'info' },
  'pending-cleanup': { icon: 'clean', tone: 'warning' },
  'today-tasks': { icon: 'collection', tone: 'primary' },
}[props.metric.id] ?? { icon: 'dashboard', tone: 'primary' }))
</script>

<template>
  <article class="metric-card panel" :aria-label="`${metric.label}：${formattedValue}${metric.unit ?? ''}`">
    <span class="metric-card__icon" :class="`metric-card__icon--${metricPresentation.tone}`" aria-hidden="true">
      <AppIcon :name="metricPresentation.icon" />
    </span>
    <div class="metric-card__content">
      <p class="metric-card__label">{{ metric.label }}</p>
      <p class="metric-card__value">
        {{ formattedValue }}<span v-if="metric.unit" class="metric-card__unit">{{ metric.unit }}</span>
      </p>
      <p class="metric-card__change" :class="changeClass">
        <span aria-hidden="true">{{ Number(metric.change) < 0 ? '↓' : '↑' }}</span>
        {{ Math.abs(Number(metric.change) || 0) }}% {{ metric.changeLabel }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.metric-card {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-5);
}

.metric-card__icon {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  color: var(--color-primary);
}

.metric-card__icon .app-icon {
  width: 30px;
  height: 30px;
  stroke-width: 2;
}

.metric-card__icon--info {
  color: var(--color-info);
}

.metric-card__icon--warning {
  color: var(--color-warning);
}

.metric-card__content {
  display: grid;
  min-width: 0;
  gap: var(--space-1);
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
