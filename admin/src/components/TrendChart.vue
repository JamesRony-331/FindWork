<script setup>
import { computed, useId } from 'vue'
import { toPolylinePoints } from '../utils/dashboard.js'

const props = defineProps({
  rows: { type: Array, required: true },
  title: { type: String, required: true },
})

const chartWidth = 560
const chartHeight = 156
const chartPadding = 18
const headingId = useId()
const points = computed(() => toPolylinePoints(props.rows.map((row) => row.value), chartWidth, chartHeight, chartPadding))
const coordinates = computed(() => points.value.split(' ').filter(Boolean).map((point) => {
  const [x, y] = point.split(',')
  return { x, y }
}))
const summary = computed(() => props.rows.map((row) => `${row.label} ${row.value}`).join('，'))
</script>

<template>
  <section class="trend-chart panel" :aria-labelledby="headingId">
    <h2 :id="headingId" class="trend-chart__title">{{ title }}</h2>
    <svg
      class="trend-chart__graphic"
      :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
      role="img"
      :aria-label="`${title}：${summary}`"
    >
      <path d="M18 30H542M18 78H542M18 126H542" class="trend-chart__grid" />
      <polyline :points="points" class="trend-chart__line" />
      <g v-for="(row, index) in rows" :key="row.id">
        <text :x="coordinates[index]?.x" :y="Math.max(Number(coordinates[index]?.y) - 9, 12)" class="trend-chart__point-value">{{ row.value }}</text>
        <circle :cx="coordinates[index]?.x" :cy="coordinates[index]?.y" r="3" class="trend-chart__point" />
      </g>
    </svg>
    <ul class="trend-chart__values" :aria-label="`${title}数据列表`">
      <li v-for="row in rows" :key="row.id"><span>{{ row.label }}</span><strong>{{ row.value }}</strong></li>
    </ul>
  </section>
</template>

<style scoped>
.trend-chart {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.trend-chart__title {
  font-size: var(--font-size-section);
  line-height: 1.4;
}

.trend-chart__graphic {
  width: 100%;
  color: var(--color-primary);
}

.trend-chart__grid {
  fill: none;
  stroke: var(--color-border);
  stroke-dasharray: 4 4;
  stroke-width: 1;
}

.trend-chart__line {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.trend-chart__point {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 2;
}

.trend-chart__point-value {
  fill: var(--color-text);
  font-size: 9px;
  text-anchor: middle;
}

.trend-chart__values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: var(--space-2);
}

.trend-chart__values li {
  display: grid;
  gap: var(--space-1);
  color: var(--color-muted);
  font-size: var(--font-size-caption);
}

.trend-chart__values strong {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .trend-chart__line,
  .trend-chart__point {
    transition: none;
  }
}
</style>
