<script setup>
import PublicLayout from '../../layouts/PublicLayout.vue';
import AppIcon from '../../components/common/AppIcon.vue';
import {
  getHomeActions,
  homeCities,
  homeFacts,
  homeFeatureLinks,
  homeMetrics,
  homePreviewMeta,
  homeTrend,
} from '../../data/common/home';
const actions = getHomeActions();
</script>
<template>
  <PublicLayout>
    <section class="home-hero">
      <div class="hero-copy">
        <h1>
          让招聘数据成为
          <br />
          毕业生就业选择的依据
        </h1>
        <p>
          汇集高校毕业生相关招聘信息，从岗位需求、薪资水平、城市机会、学历要求和专业方向等维度，提供清晰、可信的数据参考。
        </p>
        <div class="hero-actions">
          <router-link
            v-for="action in actions"
            :key="action.path"
            class="button"
            :class="{ 'button-primary': action.primary, 'button-featured': action.featured }"
            :to="action.path"
          >
            {{ action.label }}
            <AppIcon name="arrow-right" :size="15" />
          </router-link>
        </div>
        <dl class="hero-facts">
          <div v-for="item in homeFacts" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="dashboard-preview" aria-label="数据看板预览">
        <header class="preview-header">
          <div>
            <strong>{{ homePreviewMeta.title }}</strong>
            <span>{{ homePreviewMeta.updatedAt }}</span>
          </div>
          <span class="preview-status">
            <i />
            {{ homePreviewMeta.status }}
          </span>
        </header>
        <div class="metric-grid">
          <article v-for="item in homeMetrics" :key="item.label" class="metric-card">
            <span class="metric-icon"><AppIcon :name="item.icon" :size="18" /></span>
            <div>
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <small>{{ item.note }}</small>
            </div>
          </article>
        </div>
        <div class="preview-panels">
          <section class="trend-panel">
            <div class="panel-title">
              <strong>岗位数量趋势</strong>
              <span>近 6 个月</span>
            </div>
            <div class="trend-bars">
              <div v-for="item in homeTrend" :key="item.month" class="trend-item">
                <i :style="{ height: `${item.value}%` }" />
                <span>{{ item.month }}</span>
              </div>
            </div>
          </section>
          <section class="city-panel">
            <div class="panel-title">
              <strong>热门就业城市</strong>
              <span>岗位数</span>
            </div>
            <ol>
              <li v-for="(item, index) in homeCities" :key="item.name">
                <b>{{ index + 1 }}</b>
                <span>{{ item.name }}</span>
                <i><em :style="{ width: `${item.percent}%` }" /></i>
                <strong>{{ item.value.toLocaleString() }}</strong>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </section>

    <section class="feature-section">
      <header>
        <div>
          <h2>从招聘信息中看见就业方向</h2>
          <p>围绕毕业生真正关心的问题，提供结构化的数据查询与分析入口。</p>
        </div>
        <router-link to="/user/dashboard/charts">
          查看全部图表
          <AppIcon name="arrow-right" :size="14" />
        </router-link>
      </header>
      <div class="feature-grid">
        <router-link
          v-for="item in homeFeatureLinks"
          :key="item.path"
          class="feature-item"
          :to="item.path"
        >
          <span><AppIcon :name="item.icon" :size="22" /></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <b aria-hidden="true"><AppIcon name="arrow-right" :size="15" /></b>
        </router-link>
      </div>
    </section>
  </PublicLayout>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: minmax(380px, 0.85fr) minmax(600px, 1.15fr);
  gap: 64px;
  align-items: center;
  max-width: 1320px;
  min-height: 680px;
  margin: auto;
  padding: 64px 28px 56px;
}
.hero-copy h1 {
  max-width: 600px;
  color: var(--color-primary-900);
  font-size: 46px;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
.hero-copy > p {
  max-width: 590px;
  margin-top: 24px;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.85;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}
.hero-actions .button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 150px;
}
.hero-facts {
  display: flex;
  gap: 42px;
  margin-top: 42px;
}
.hero-facts div {
  padding-left: 14px;
  border-left: 2px solid var(--color-accent);
}
.hero-facts dt {
  margin-bottom: 5px;
  color: var(--color-text-muted);
  font-size: 12px;
}
.hero-facts dd {
  color: var(--color-primary-900);
  font-size: 14px;
  font-weight: 600;
}
.dashboard-preview {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 48px rgba(7, 51, 74, 0.11);
}
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}
.preview-header > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.preview-header strong {
  color: var(--color-primary-900);
  font-size: 16px;
}
.preview-header span {
  color: var(--color-text-muted);
  font-size: 11px;
}
.preview-status {
  display: flex;
  align-items: center;
  gap: 6px !important;
  padding: 5px 9px;
  border-radius: 5px;
  color: var(--color-success) !important;
  background: #edf8f4;
}
.preview-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 16px;
}
.metric-card {
  display: flex;
  gap: 10px;
  min-width: 0;
  padding: 13px 11px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface-muted);
}
.metric-icon {
  display: grid;
  place-items: center;
  flex: 0 0 32px;
  height: 32px;
  border-radius: 5px;
  color: var(--color-primary-700);
  background: var(--color-accent-soft);
}
.metric-card div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.metric-card div > span,
.metric-card small {
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.metric-card strong {
  margin: 2px 0;
  color: var(--color-primary-900);
  font-size: 19px;
}
.preview-panels {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 12px;
  margin-top: 12px;
}
.preview-panels > section {
  min-width: 0;
  padding: 15px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-title strong {
  color: var(--color-primary-900);
  font-size: 13px;
}
.panel-title span {
  color: var(--color-text-muted);
  font-size: 10px;
}
.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 190px;
  margin-top: 14px;
  padding-top: 10px;
  border-bottom: 1px solid var(--color-border);
}
.trend-item {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
}
.trend-item i {
  width: 62%;
  min-height: 20px;
  border-radius: 3px 3px 0 0;
  background: var(--color-accent);
}
.trend-item span {
  color: var(--color-text-muted);
  font-size: 9px;
}
.city-panel ol {
  display: grid;
  gap: 18px;
  margin-top: 23px;
}
.city-panel li {
  display: grid;
  grid-template-columns: 20px 34px 1fr 42px;
  gap: 7px;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 11px;
}
.city-panel li > b {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: var(--color-primary-700);
  background: var(--color-accent-soft);
  font-size: 9px;
}
.city-panel li > i {
  height: 5px;
  overflow: hidden;
  border-radius: 3px;
  background: #eaf0f3;
}
.city-panel em {
  display: block;
  height: 100%;
  background: var(--color-accent);
}
.city-panel li > strong {
  text-align: right;
  color: var(--color-primary-900);
  font-size: 11px;
}
.feature-section {
  padding: 60px max(28px, calc((100vw - 1264px) / 2)) 72px;
  border-top: 1px solid var(--color-border);
  background: #fff;
}
.feature-section > header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
}
.feature-section h2 {
  color: var(--color-primary-900);
  font-size: 28px;
}
.feature-section header p {
  margin-top: 8px;
  color: var(--color-text-secondary);
}
.feature-section header > a {
  color: var(--color-primary-700);
  font-size: 13px;
  font-weight: 600;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.feature-item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 24px;
  border-right: 1px solid var(--color-border);
}
.feature-item:last-child {
  border-right: 0;
}
.feature-item > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 6px;
  color: var(--color-primary-700);
  background: var(--color-accent-soft);
}
.feature-item h3 {
  margin-bottom: 7px;
  color: var(--color-primary-900);
  font-size: 15px;
}
.feature-item p {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.65;
}
.feature-item > b {
  color: var(--color-text-muted);
  font-weight: 400;
}
.feature-item:hover {
  background: var(--color-surface-muted);
}
.feature-item:hover > b {
  color: var(--color-accent);
}
.hero-actions .button-featured {
  min-width: 184px;
  height: 48px;
  border-color: #b4dc28;
  color: #07334a;
  background: #b4dc28;
  box-shadow: 0 10px 26px rgba(128, 166, 18, 0.24);
  font-weight: 700;
  animation: featured-pulse 2.8s ease-in-out infinite;
}
.hero-actions .button-featured:hover {
  border-color: #c7ed43;
  background: #c7ed43;
  box-shadow: 0 13px 30px rgba(128, 166, 18, 0.34);
  transform: translateY(-2px);
}
@keyframes featured-pulse {
  0%,
  100% {
    box-shadow: 0 10px 26px rgba(128, 166, 18, 0.22);
  }
  50% {
    box-shadow: 0 12px 34px rgba(128, 166, 18, 0.42);
  }
}
@media (max-width: 1100px) {
  .home-hero {
    grid-template-columns: 1fr;
    gap: 42px;
  }
  .dashboard-preview {
    width: 100%;
  }
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .feature-item:nth-child(2) {
    border-right: 0;
  }
  .feature-item:nth-child(-n + 2) {
    border-bottom: 1px solid var(--color-border);
  }
}
@media (max-width: 700px) {
  .home-hero {
    display: block;
    min-height: auto;
    padding: 46px 18px;
  }
  .hero-copy h1 {
    font-size: 34px;
  }
  .hero-facts {
    gap: 20px;
    flex-direction: column;
    margin-top: 32px;
  }
  .dashboard-preview {
    margin-top: 40px;
    padding: 13px;
  }
  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .preview-panels {
    grid-template-columns: 1fr;
  }
  .trend-bars {
    height: 150px;
  }
  .feature-section {
    padding: 44px 18px 56px;
  }
  .feature-section > header {
    align-items: flex-start;
    gap: 18px;
    flex-direction: column;
  }
  .feature-section h2 {
    font-size: 24px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .feature-item,
  .feature-item:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }
  .feature-item:last-child {
    border-bottom: 0;
  }
}
@media (max-width: 430px) {
  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .hero-actions .button {
    width: 100%;
  }
  .metric-grid {
    grid-template-columns: 1fr;
  }
  .preview-header {
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }
  .dashboard-preview {
    overflow: hidden;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-actions .button-featured {
    animation: none;
  }
}
</style>
