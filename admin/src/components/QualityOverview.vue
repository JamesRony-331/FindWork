<script setup>
import { computed, useId } from 'vue'
import { toPercent } from '../utils/dashboard.js'

const props = defineProps({
  rows: { type: Array, required: true },
  title: { type: String, required: true },
})

const qualityRows = computed(() => props.rows.map((row) => ({ ...row, percent: toPercent(Number(row.value), 100) })))
const headingId = useId()
</script>

<template>
  <section class="quality-overview panel" :aria-labelledby="headingId">
    <h2 :id="headingId" class="quality-overview__title">{{ title }}</h2>
    <ul class="quality-overview__list" :aria-label="`${title}数据列表`">
      <li v-for="row in qualityRows" :key="row.id" class="quality-overview__item">
        <div class="quality-overview__labels"><span>{{ row.label }}</span><strong>{{ row.percent.toFixed(1) }}%</strong></div>
        <div
          class="quality-overview__track"
          role="progressbar"
          :aria-label="row.label"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="row.percent"
        >
          <span class="quality-overview__fill" :style="{ width: `${row.percent}%` }"></span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.quality-overview {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.quality-overview__title {
  font-size: var(--font-size-section);
  line-height: 1.4;
}

.quality-overview__list {
  display: grid;
  gap: var(--space-4);
}

.quality-overview__item {
  display: grid;
  gap: var(--space-2);
}

.quality-overview__labels {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--font-size-body);
}

.quality-overview__labels strong {
  color: var(--color-primary);
}

.quality-overview__track {
  height: 8px;
  overflow: hidden;
  border-radius: var(--radius-control);
  background: var(--color-page);
}

.quality-overview__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-success);
  transition: width 180ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .quality-overview__fill {
    transition: none;
  }
}
</style>
