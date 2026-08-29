<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import UserLayout from '../../../layouts/UserLayout.vue';
import StatusView from '../../../components/common/StatusView.vue';
import { getDetailFields, getJobDetail } from '../../../data/user/jobDetail';
const route = useRoute();
const job = computed(() => getJobDetail(route.params.id));
const fields = computed(() => getDetailFields(job.value));
</script>
<template>
  <UserLayout>
    <div class="page-content detail-page">
      <router-link class="back-link" to="/user/jobs">← 返回岗位列表</router-link>
      <template v-if="job">
        <header class="detail-header">
          <div>
            <h1>{{ job.jobName }}</h1>
            <p>{{ job.company }}</p>
          </div>
          <strong>{{ job.salary }}</strong>
        </header>
        <section class="detail-section">
          <dl class="detail-list">
            <div v-for="field in fields" :key="field.label">
              <dt>{{ field.label }}</dt>
              <dd>{{ field.value }}</dd>
            </div>
          </dl>
        </section>
        <section class="detail-section">
          <h2>岗位描述</h2>
          <ol class="description-list">
            <li v-for="(item, index) in job.description" :key="index">
              {{ index + 1 }}. {{ item }}
            </li>
          </ol>
        </section>
        <section class="detail-section source-section">
          <div>
            <span>数据来源</span>
            <strong>{{ job.source }}</strong>
          </div>
          <div>
            <span>采集时间</span>
            <strong>{{ job.collectTime }}</strong>
          </div>
        </section>
      </template>
      <section v-else class="panel">
        <StatusView title="岗位信息不存在" description="该岗位可能已下线或演示数据中没有对应记录">
          <router-link class="button" to="/user/jobs">返回岗位列表</router-link>
        </StatusView>
      </section>
    </div>
  </UserLayout>
</template>
<style scoped>
.detail-page {
  max-width: 1120px;
}
.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--color-info);
}
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 28px;
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  background: #fff;
}
.detail-header h1 {
  font-size: 26px;
  color: var(--color-primary-900);
}
.detail-header p {
  margin-top: 6px;
  color: var(--color-text-secondary);
}
.detail-header > strong {
  color: var(--color-warning);
  font-size: 20px;
}
.detail-section {
  padding: 10px 28px 24px;
  border: 1px solid var(--color-border);
  border-top: 0;
  background: #fff;
}
.detail-section:last-child {
  border-radius: 0 0 8px 8px;
}
.detail-list div {
  display: grid;
  grid-template-columns: 140px 1fr;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
}
dt {
  color: var(--color-text-secondary);
}
dd {
  margin: 0;
  color: var(--color-text);
}
.detail-section h2 {
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 16px;
  color: var(--color-primary-900);
}
.description-list {
  display: grid;
  gap: 10px;
  padding-top: 16px;
  color: var(--color-text-secondary);
}
.source-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.source-section div {
  display: flex;
  gap: 24px;
  padding-top: 14px;
}
.source-section span {
  color: var(--color-text-secondary);
}
.source-section strong {
  font-weight: 500;
}
@media (max-width: 600px) {
  .detail-header {
    display: block;
    padding: 22px 18px;
  }
  .detail-header > strong {
    display: block;
    margin-top: 12px;
  }
  .detail-section {
    padding-left: 18px;
    padding-right: 18px;
  }
  .detail-list div {
    grid-template-columns: 96px 1fr;
  }
  .source-section {
    grid-template-columns: 1fr;
  }
}
</style>
