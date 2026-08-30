<script setup>
import { computed, useId } from 'vue'
import { toPercent } from '../utils/dashboard.js'

const props = defineProps({
  rows: { type: Array, required: true },
  title: { type: String, required: true },
})

const maximum = computed(() => Math.max(0, ...props.rows.map((row) => Number(row.value) || 0)))
const bars = computed(() => props.rows.map((row) => ({ ...row, percent: toPercent(Number(row.value), maximum.value) })))
const headingId = useId()
</script>

<template>
  <section class="horizontal-bars panel" :aria-labelledby="headingId">
    <h2 :id="headingId" class="horizontal-bars__title">{{ title }}</h2>
    <ol class="horizontal-bars__list" :aria-label="`${title}数据列表`">
      <li v-for="row in bars" :key="row.id" class="horizontal-bars__item">
        <span class="horizontal-bars__label">{{ row.label }}</span>
        <span class="horizontal-bars__track" aria-hidden="true"><span class="horizontal-bars__fill" :style="{ width: `${row.percent}%` }"></span></span>
        <strong class="horizontal-bars__value">{{ row.value }}</strong>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.horizontal-bars {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.horizontal-bars__title {
  font-size: var(--font-size-section);
  line-height: 1.4;
}

.horizontal-bars__list {
  display: grid;
  gap: var(--space-3);
}

.horizontal-bars__item {
  display: grid;
  grid-template-columns: minmax(64px, 0.8fr) minmax(80px, 2fr) auto;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-caption);
}

.horizontal-bars__track {
  display: block;
  height: 8px;
  overflow: hidden;
  border-radius: var(--radius-control);
  background: var(--color-page);
}

.horizontal-bars__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 180ms ease;
}

.horizontal-bars__value {
  min-width: 4ch;
  text-align: right;
}

@media (prefers-reduced-motion: reduce) {
  .horizontal-bars__fill {
    transition: none;
  }
}
</style>
