<script setup>
import HorizontalBars from '../components/HorizontalBars.vue'
import MetricCard from '../components/MetricCard.vue'
import QualityOverview from '../components/QualityOverview.vue'
import SourceDonut from '../components/SourceDonut.vue'
import StatusTag from '../components/StatusTag.vue'
import TrendChart from '../components/TrendChart.vue'
import {
  alerts,
  cityRanking,
  collectionTasks,
  collectionTrend,
  dashboardMeta,
  metrics,
  qualitySummary,
  recentActivities,
  sourceShare,
} from '../data/dashboard.js'
</script>

<template>
  <div class="dashboard-view">
    <header class="dashboard-heading">
      <div>
        <h1>{{ dashboardMeta.title }}</h1>
        <p>{{ dashboardMeta.description }}</p>
      </div>
      <span class="dashboard-heading__demo">演示数据</span>
    </header>

    <section class="dashboard-metrics" aria-label="概览指标">
      <div v-for="metric in metrics" :key="metric.id" class="dashboard-metric">
        <MetricCard :metric="metric" />
        <span class="dashboard-metric__demo">演示数据</span>
      </div>
    </section>

    <section class="dashboard-grid dashboard-grid--primary" aria-label="主要数据图表">
      <TrendChart title="近七日采集趋势" :rows="collectionTrend" />
      <SourceDonut title="数据来源占比" :rows="sourceShare" />
    </section>

    <section class="dashboard-grid dashboard-grid--secondary" aria-label="数据分布与质量">
      <HorizontalBars title="热门城市岗位分布" :rows="cityRanking" />
      <QualityOverview title="数据质量概况" :rows="qualitySummary" />
    </section>

    <section class="dashboard-grid dashboard-grid--operations" aria-label="运行管理">
      <article class="dashboard-table panel" aria-labelledby="collection-tasks-title">
        <h2 id="collection-tasks-title">采集任务</h2>
        <div class="dashboard-table__scroll" tabindex="0">
          <table>
            <thead>
              <tr><th>任务名</th><th>数据源</th><th>最近运行</th><th>采集量</th><th>状态</th></tr>
            </thead>
            <tbody>
              <tr v-for="task in collectionTasks" :key="task.id">
                <td>{{ task.name }}</td>
                <td>{{ task.source }}</td>
                <td>{{ task.lastRun }}</td>
                <td>{{ task.count.toLocaleString('zh-CN') }}</td>
                <td><StatusTag :status="task.status" :label="task.statusLabel" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="dashboard-table dashboard-activity panel" aria-labelledby="recent-activities-title">
        <h2 id="recent-activities-title">最近操作</h2>
        <div class="dashboard-table__scroll" tabindex="0">
          <table>
            <thead>
              <tr><th>时间</th><th>操作人</th><th>操作</th><th>对象</th></tr>
            </thead>
            <tbody>
              <tr v-for="activity in recentActivities" :key="activity.id">
                <td>{{ activity.time }}</td>
                <td>{{ activity.operator }}</td>
                <td>{{ activity.action }}</td>
                <td>{{ activity.target }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dashboard-alerts" aria-label="异常提醒">
          <strong>异常提醒：</strong>
          <span v-for="alert in alerts" :key="alert.id">{{ alert.label }} <b>{{ alert.count }}</b></span>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-view {
  display: grid;
  gap: var(--space-2);
}

.dashboard-heading {
  display: flex;
  min-height: 64px;
  align-items: flex-end;
  gap: var(--space-3);
}

.dashboard-heading h1 {
  font-size: var(--font-size-title);
  line-height: 1.3;
}

.dashboard-heading p {
  margin-top: var(--space-1);
  color: var(--color-muted);
  font-size: var(--font-size-body);
}

.dashboard-heading__demo {
  margin-bottom: 2px;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-info);
  border-radius: var(--radius-control);
  color: var(--color-text);
  font-size: var(--font-size-caption);
  font-weight: 600;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}

.dashboard-metric {
  position: relative;
  min-width: 0;
}

.dashboard-metric :deep(.metric-card) {
  height: 100%;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4) 28px;
}

.dashboard-metric__demo {
  position: absolute;
  right: var(--space-5);
  bottom: var(--space-3);
  color: var(--color-text);
  font-size: var(--font-size-caption);
}

.dashboard-grid {
  display: grid;
  gap: var(--space-2);
}

.dashboard-grid--primary {
  grid-template-columns: minmax(0, 1.1fr) minmax(380px, 1fr);
}

.dashboard-grid--secondary,
.dashboard-grid--operations {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-grid--primary > * {
  min-height: 248px;
}

.dashboard-grid--primary :deep(.trend-chart),
.dashboard-grid--primary :deep(.source-donut) {
  gap: var(--space-2);
  padding: var(--space-4);
}

.dashboard-grid--secondary :deep(.horizontal-bars),
.dashboard-grid--secondary :deep(.quality-overview) {
  gap: 6px;
  padding: var(--space-3);
}

.dashboard-grid--secondary :deep(.horizontal-bars__list) {
  gap: var(--space-1);
}

.dashboard-grid--secondary :deep(.horizontal-bars__item) {
  line-height: 1.2;
}

.dashboard-grid--secondary :deep(.horizontal-bars__track),
.dashboard-grid--secondary :deep(.quality-overview__track) {
  height: 6px;
}

.dashboard-grid--secondary :deep(.quality-overview__list) {
  gap: 6px;
}

.dashboard-grid--secondary :deep(.quality-overview__item) {
  gap: var(--space-1);
}

.dashboard-grid--secondary :deep(.quality-overview__labels) {
  font-size: var(--font-size-caption);
  line-height: 1.2;
}

.dashboard-table {
  min-width: 0;
  padding: var(--space-3);
}

.dashboard-table h2 {
  margin-bottom: var(--space-2);
  font-size: var(--font-size-section);
  line-height: 1.4;
}

.dashboard-table__scroll {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}

.dashboard-table__scroll:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.dashboard-table table {
  width: 100%;
  text-align: left;
}

.dashboard-table th,
.dashboard-table td {
  height: 30px;
  padding: 0 var(--space-3);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-caption);
  white-space: nowrap;
}

.dashboard-table th {
  background: var(--color-page);
  color: var(--color-muted);
  font-weight: 600;
}

.dashboard-table tbody tr:last-child td {
  border-bottom: 0;
}

.dashboard-alerts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  padding: var(--space-2) var(--space-1) 0;
  border-left: 2px solid var(--color-danger);
  color: var(--color-muted);
  font-size: var(--font-size-caption);
}

.dashboard-alerts strong,
.dashboard-alerts b {
  color: var(--color-text);
}
</style>
