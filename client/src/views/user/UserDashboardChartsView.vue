<script setup>
import UserLayout from '../../layouts/UserLayout.vue';
import PageHeader from '../../components/common/PageHeader.vue';
import BaseChart from '../../components/charts/BaseChart.vue';
import { charts, pageMeta } from '../../data/user/dashboardCharts';
</script>
<template>
  <UserLayout>
    <div class="page-content">
      <PageHeader v-bind="pageMeta" />
      <div class="chart-grid overview-grid">
        <section
          v-for="(chart, index) in charts"
          :key="chart.title"
          class="panel chart-panel"
          :class="{ wide: index === 0 || index === 4 }"
        >
          <div class="panel-heading">
            <h2 class="panel-title">{{ chart.title }}</h2>
          </div>
          <div class="panel-body"><BaseChart :option="chart.option" height="320px" /></div>
        </section>
      </div>
    </div>
  </UserLayout>
</template>
<style scoped>
.overview-grid .wide {
  grid-column: 1/-1;
}
@media (max-width: 760px) {
  .overview-grid .wide {
    grid-column: auto;
  }
}
</style>
