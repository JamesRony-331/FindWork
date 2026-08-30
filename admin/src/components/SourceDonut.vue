<script setup>
import { computed, useId } from 'vue'
import { toPercent } from '../utils/dashboard.js'

const props = defineProps({
  rows: { type: Array, required: true },
  title: { type: String, required: true },
})

const colors = ['var(--color-primary)', 'var(--color-info)', 'var(--color-success)', 'var(--color-warning)']
const headingId = useId()

function normalizeSourceValue(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0
}

const normalizedRows = computed(() => props.rows.map((row) => ({ ...row, value: normalizeSourceValue(row.value) })))
const total = computed(() => normalizedRows.value.reduce((sum, row) => sum + row.value, 0))
const rowsWithPercent = computed(() => normalizedRows.value.map((row) => ({ ...row, percent: toPercent(row.value, total.value) })))
const donutStyle = computed(() => {
  let start = 0
  const segments = rowsWithPercent.value.map((row, index) => {
    const end = start + row.percent
    const segment = `${colors[index % colors.length]} ${start}% ${end}%`
    start = end
    return segment
  })

  return { background: `conic-gradient(${segments.length ? segments.join(', ') : 'var(--color-page) 0% 100%'})` }
})
const summary = computed(() => rowsWithPercent.value.map((row) => `${row.label} ${row.percent.toFixed(1)}%`).join('，'))
</script>

<template>
  <section class="source-donut panel" :aria-labelledby="headingId">
    <h2 :id="headingId" class="source-donut__title">{{ title }}</h2>
    <div class="source-donut__content">
      <div class="source-donut__chart" :style="donutStyle" role="img" :aria-label="`${title}：${summary}`">
        <span class="source-donut__total"><strong>{{ total }}</strong><span>总计</span></span>
      </div>
      <ul class="source-donut__legend" :aria-label="`${title}数据列表`">
        <li v-for="(row, index) in rowsWithPercent" :key="row.id">
          <span class="source-donut__marker" :style="{ background: colors[index % colors.length] }" aria-hidden="true"></span>
          <span>{{ row.label }}</span>
          <strong>{{ row.percent.toFixed(1) }}%</strong>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.source-donut {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.source-donut__title {
  font-size: var(--font-size-section);
  line-height: 1.4;
}

.source-donut__content {
  display: grid;
  grid-template-columns: minmax(132px, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: var(--space-5);
}

.source-donut__chart {
  display: grid;
  width: min(100%, 176px);
  aspect-ratio: 1;
  place-items: center;
  margin: 0 auto;
  border-radius: 50%;
}

.source-donut__chart::before {
  grid-area: 1 / 1;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 50%;
  content: '';
  background: var(--color-surface);
}

.source-donut__total {
  z-index: 1;
  grid-area: 1 / 1;
  display: grid;
  place-items: center;
  color: var(--color-muted);
  font-size: var(--font-size-caption);
}

.source-donut__total strong {
  color: var(--color-text);
  font-size: var(--font-size-section);
}

.source-donut__legend {
  display: grid;
  gap: var(--space-2);
}

.source-donut__legend li {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-caption);
}

.source-donut__marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

@media (max-width: 440px) {
  .source-donut__content {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .source-donut__chart {
    transition: none;
  }
}
</style>
