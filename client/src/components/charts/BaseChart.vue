<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { init, use } from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);
const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '300px' },
});
const root = ref(null);
let chart;
let observer;
let resizeFrame;
onMounted(() => {
  chart = init(root.value);
  chart.setOption(props.option);
  observer = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => chart?.resize());
  });
  observer.observe(root.value);
});
watch(
  () => props.option,
  (option) => chart?.setOption(option, true),
  { deep: true },
);
onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(resizeFrame);
  chart?.dispose();
});
</script>
<template><div ref="root" class="base-chart" :style="{ height }" /></template>
<style scoped>
.base-chart {
  width: 100%;
  min-width: 0;
}
</style>
