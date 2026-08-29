# 静态前端重设计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `client/Gworking` 中实现 15 个可运行、可交互、变量驱动的公共端和普通用户端静态页面。

**Architecture:** 通过 `PublicLayout` 与 `UserLayout` 统一应用外壳，通过小型原生 Vue 组件复用筛选、表格、图表和状态展示。每个页面使用独立 `src/data/**/<page>.js` 模块导出数据、ECharts 配置和事件函数，Vue 模板仅负责组合与 `v-for` 渲染。

**Tech Stack:** Vue 3、Vue Router、原生 HTML/CSS/SVG、ECharts、Vite、Node.js 内置测试运行器

**Spec:** `docs/superpowers/specs/2026-08-28-frontend-static-redesign-design.md`

## Global Constraints

- 仅实现公共端和普通用户端 15 个路由页面；管理员端不进入导航、不实施。
- 仅新增 `echarts`，不安装 Element Plus、图标库或其他 UI 框架。
- 每个页面的数据和函数必须位于独立 JS 文件，并由页面导入。
- 所有重复演示内容必须来自变量并使用 `v-for` 渲染。
- 保持现有路由路径、页面文件名和 `Request.js` 接口约定。
- 不接后端、不实现真实鉴权或真实 AI。
- 不使用渐变、玻璃拟态、卡片墙、夸张阴影和装饰性动效。
- 概念图位于 `docs/design-concepts/`，实现需删除其中误出现的管理端导航。

---

### Task 1: 项目基础、设计令牌与纯函数测试

**Files:**

- Modify: `package.json`
- Modify: `src/main.js`
- Modify: `src/App.vue`
- Replace: `src/style.css`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/components.css`
- Create: `src/styles/responsive.css`
- Create: `src/utils/pageData.js`
- Create: `tests/pageData.test.js`

**Interfaces:**

- Produces: `filterRows(rows, query, keys) -> Array`、`paginateRows(rows, page, pageSize) -> { rows, total, page, pageCount }`、`resetObject(target, defaults) -> object`
- Produces: 全局 CSS 类 `.page-shell`、`.page-header`、`.panel`、`.filter-bar`、`.data-table`、`.button`

- [ ] **Step 1: 安装 ECharts 并加入测试脚本**

运行：`npm install echarts`，并在 `package.json` 增加 `"test": "node --test"`。

- [ ] **Step 2: 为数据函数编写失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRows, paginateRows, resetObject } from '../src/utils/pageData.js';

test('filterRows 在指定字段中进行不区分大小写的包含匹配', () => {
  const rows = [
    { job: 'Java 开发', city: '杭州' },
    { job: '测试工程师', city: '上海' },
  ];
  assert.deepEqual(filterRows(rows, 'java', ['job']), [rows[0]]);
});

test('paginateRows 返回当前页和总页数', () => {
  const result = paginateRows([1, 2, 3, 4, 5], 2, 2);
  assert.deepEqual(result, { rows: [3, 4], total: 5, page: 2, pageCount: 3 });
});

test('resetObject 用默认值覆盖目标对象', () => {
  const target = { city: '杭州', keyword: 'Java' };
  resetObject(target, { city: '', keyword: '' });
  assert.deepEqual(target, { city: '', keyword: '' });
});
```

- [ ] **Step 3: 运行测试并确认失败**

运行：`npm test`。预期：因 `src/utils/pageData.js` 不存在而失败。

- [ ] **Step 4: 实现纯函数与全局样式基础**

```js
export function filterRows(rows, query, keys) {
  const needle = String(query ?? '')
    .trim()
    .toLowerCase();
  if (!needle) return [...rows];
  return rows.filter((row) =>
    keys.some((key) =>
      String(row[key] ?? '')
        .toLowerCase()
        .includes(needle),
    ),
  );
}

export function paginateRows(rows, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page: safePage,
    pageCount,
  };
}

export function resetObject(target, defaults) {
  Object.assign(target, defaults);
  return target;
}
```

`App.vue` 只保留 `<router-view />`；`main.js` 引入四个样式文件。令牌定义主色、背景、文本、边框、语义色、字号、间距、圆角和阴影，并关闭原模板暗色模式。

- [ ] **Step 5: 运行测试和构建**

运行：`npm test && npm run build`。预期：测试全部通过且 Vite 构建成功。

### Task 2: 应用布局、导航与通用组件

**Files:**

- Create: `src/data/navigation.js`
- Create: `src/layouts/PublicLayout.vue`
- Create: `src/layouts/UserLayout.vue`
- Create: `src/components/common/AppIcon.vue`
- Create: `src/components/common/PageHeader.vue`
- Create: `src/components/common/StatusView.vue`
- Create: `src/components/forms/FilterBar.vue`
- Create: `src/components/tables/DataTable.vue`
- Create: `src/components/tables/AppPagination.vue`
- Create: `src/components/charts/BaseChart.vue`
- Create: `tests/navigation.test.js`

**Interfaces:**

- Produces: `publicNavItems`、`userNavGroups`，且不包含 `/admin/*`
- Produces: `<PublicLayout>`、`<UserLayout>` 插槽接口
- Produces: `<BaseChart :option height>`、`<DataTable :columns :rows>`、`<FilterBar :fields v-model>`、`<AppPagination :page :page-size :total>`

- [ ] **Step 1: 编写导航失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { userNavGroups } from '../src/data/navigation.js';

test('用户导航不包含管理端路由', () => {
  const paths = userNavGroups.flatMap((group) => group.items.map((item) => item.path));
  assert.equal(
    paths.some((path) => path.startsWith('/admin/')),
    false,
  );
  assert.equal(paths.includes('/user/jobs'), true);
  assert.equal(paths.includes('/user/ai-chat'), true);
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因导航模块不存在而失败。

- [ ] **Step 3: 实现导航、布局和通用组件**

导航数据使用 `{ label, path, icon }`；`UserLayout` 根据 `$route.path` 设置选中态并支持窄屏收起。`BaseChart` 使用 `echarts.init`、`setOption`、`ResizeObserver` 和 `onBeforeUnmount`；表格、分页和筛选组件使用原生语义元素并透传事件。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：导航测试通过，组件可编译。

### Task 3: 公共端四个页面

**Files:**

- Create: `src/data/common/home.js`
- Create: `src/data/common/login.js`
- Create: `src/data/common/register.js`
- Create: `src/data/common/profile.js`
- Modify: `src/views/common/HomeView.vue`
- Modify: `src/views/common/LoginView.vue`
- Modify: `src/views/common/RegisterView.vue`
- Modify: `src/views/common/ProfileView.vue`
- Create: `tests/authData.test.js`

**Interfaces:**

- Consumes: `PublicLayout`、全局按钮/表单样式
- Produces: `validateLogin(form)`、`validateRegister(form)`、`validatePasswordChange(form)`，均返回字段错误对象

- [ ] **Step 1: 编写表单校验失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegister } from '../src/data/common/register.js';

test('注册校验拒绝不一致密码', () => {
  const errors = validateRegister({
    username: 'student01',
    password: 'abc12345',
    confirmPassword: 'abc12346',
    contact: '13800138000',
  });
  assert.equal(errors.confirmPassword, '两次输入的密码不一致');
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因注册数据模块不存在而失败。

- [ ] **Step 3: 实现四个独立数据模块和页面**

首页的能力入口、认证表单字段、用户资料项和操作函数均从对应 JS 导入；能力入口和资料项通过 `v-for` 渲染。登录成功演示跳转 `/user/dashboard`，注册成功演示跳转 `/login`，不写 Token。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：校验测试通过，四个路由构建成功。

### Task 4: 用户看板和图表总览

**Files:**

- Create: `src/data/user/dashboard.js`
- Create: `src/data/user/dashboardCharts.js`
- Modify: `src/views/user/UserDashboardView.vue`
- Modify: `src/views/user/UserDashboardChartsView.vue`
- Create: `src/components/common/MetricStrip.vue`
- Create: `src/components/common/RankingList.vue`
- Create: `tests/dashboardData.test.js`

**Interfaces:**

- Consumes: `UserLayout`、`BaseChart`
- Produces: `summaryMetrics`、`trendOption`、`topJobs`、`topCities`、`topSalaryJobs`、`categoryRatioOption`

- [ ] **Step 1: 编写看板数据结构失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { summaryMetrics, topJobs } from '../src/data/user/dashboard.js';

test('看板指标和岗位排行具有稳定标识', () => {
  assert.equal(summaryMetrics.length, 4);
  assert.equal(new Set(summaryMetrics.map((item) => item.key)).size, 4);
  assert.equal(
    topJobs.every((item) => item.name && Number.isFinite(item.value)),
    true,
  );
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因看板模块不存在而失败。

- [ ] **Step 3: 实现看板、排行和 ECharts 图表页**

数据看板首屏保持概念图密度；图表总览按文档实现岗位趋势、热门岗位 Top10、热门城市 Top10、高薪岗位 Top10 和岗位类别占比。指标、排行和图表定义全部来自页面模块。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：看板数据测试和构建通过。

### Task 5: 六个就业分析页面

**Files:**

- Create: `src/data/user/analysisFactory.js`
- Create: `src/data/user/jobDemand.js`
- Create: `src/data/user/salary.js`
- Create: `src/data/user/city.js`
- Create: `src/data/user/education.js`
- Create: `src/data/user/major.js`
- Create: `src/data/user/multiDimension.js`
- Create: `src/components/charts/AnalysisPage.vue`
- Modify: `src/views/user/analysis/JobDemandAnalysisView.vue`
- Modify: `src/views/user/analysis/SalaryAnalysisView.vue`
- Modify: `src/views/user/analysis/CityAnalysisView.vue`
- Modify: `src/views/user/analysis/EducationAnalysisView.vue`
- Modify: `src/views/user/analysis/MajorAnalysisView.vue`
- Modify: `src/views/user/analysis/MultiDimensionAnalysisView.vue`
- Create: `tests/analysisData.test.js`

**Interfaces:**

- Produces: `createAnalysisState(defaults)` 返回 `{ filters, reset(), apply() }`
- 每个页面模块导出 `pageMeta`、`filterFields`、`defaultFilters`、`charts`、`rankings`

- [ ] **Step 1: 编写分析模块结构失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import * as salary from '../src/data/user/salary.js';

test('薪资分析包含文档要求的五类可视化', () => {
  const titles = salary.charts.map((chart) => chart.title);
  for (const title of [
    '岗位平均薪资',
    '薪资区间分布',
    '城市平均薪资排行',
    '不同学历平均薪资',
    '高薪岗位 Top10',
  ]) {
    assert.equal(titles.includes(title), true);
  }
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因薪资分析模块不存在而失败。

- [ ] **Step 3: 实现六个独立模块和共享分析页组件**

共享组件只接收结构化配置，不拥有任何页面演示数据。多维分析页额外实现组合筛选、概览图、交叉分析表和重置行为；其他五页按参考文档列出的图表与排行配置 ECharts。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：六页模块测试通过且无 ECharts 编译错误。

### Task 6: 岗位列表和岗位详情

**Files:**

- Create: `src/data/user/jobs.js`
- Create: `src/data/user/jobDetail.js`
- Modify: `src/views/user/jobs/UserJobsView.vue`
- Modify: `src/views/user/jobs/UserJobDetailView.vue`
- Create: `tests/jobsData.test.js`

**Interfaces:**

- Consumes: `filterRows`、`paginateRows`、`DataTable`、`AppPagination`
- Produces: `createJobsState()` 返回筛选、分页和 `search/reset/changePage` 方法；`getJobDetail(id)` 返回详情对象

- [ ] **Step 1: 编写岗位查询失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createJobsState } from '../src/data/user/jobs.js';

test('岗位查询按关键词过滤并重置到第一页', () => {
  const state = createJobsState();
  state.filters.keyword = 'Java';
  state.search();
  assert.equal(
    state.visibleRows.every((row) => row.jobName.includes('Java')),
    true,
  );
  assert.equal(state.pagination.page, 1);
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因岗位数据模块不存在而失败。

- [ ] **Step 3: 实现列表、筛选、分页、跳转和详情定义列表**

岗位表格列严格对应文档字段；“查看详情”跳转到 `/user/jobs/:id`。详情页根据路由参数读取演示记录，未知 ID 显示共享空状态并提供返回列表入口。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：搜索测试通过，动态详情路由可构建。

### Task 7: AI 就业助手静态交互

**Files:**

- Create: `src/data/user/aiChat.js`
- Modify: `src/views/user/AiChatView.vue`
- Create: `tests/aiChat.test.js`

**Interfaces:**

- Produces: `createChatState()` 返回 `conversations`、`activeConversationId`、`draft`、`sendMessage()`、`selectSuggestion(text)`、`createConversation()`

- [ ] **Step 1: 编写发送行为失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatState } from '../src/data/user/aiChat.js';

test('发送消息后追加用户消息和演示回复并清空输入', () => {
  const state = createChatState();
  const before = state.messages.length;
  state.draft = '杭州前端岗位趋势如何？';
  state.sendMessage();
  assert.equal(state.messages.length, before + 2);
  assert.equal(state.messages.at(-2).role, 'user');
  assert.equal(state.messages.at(-1).role, 'assistant');
  assert.equal(state.draft, '');
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test`。预期：因 AI 模块不存在而失败。

- [ ] **Step 3: 实现会话侧栏、建议问题、消息列表和输入区**

演示回复从本地 `replyRules` 变量选择，回复区域显示“演示数据”说明；Enter 发送、Shift+Enter 换行，新建对话和切换历史在本地状态中工作。

- [ ] **Step 4: 运行测试和构建**

运行：`npm test && npm run build`。预期：AI 状态测试通过且页面构建成功。

### Task 8: 路由整合、全页面视觉和响应式验收

**Files:**

- Modify: `src/router/router.js`
- Modify: `src/styles/components.css`
- Modify: `src/styles/responsive.css`
- Create: `docs/design-concepts/fidelity-ledger.md`

**Interfaces:**

- Consumes: 前七个任务的全部页面和组件
- Produces: 15 个可直接访问路由、桌面与移动端一致视觉、视觉对照记录

- [ ] **Step 1: 为路由增加元数据并验证页面清单**

为 15 个本期路由增加 `meta: { layout: 'public' | 'user', title: '...' }`，保持路径不变；管理员路由保留但不加入用户导航。

- [ ] **Step 2: 运行完整自动检查**

运行：`npm test && npm run build`。预期：全部测试通过，Vite 构建无错误。

- [ ] **Step 3: 启动项目并使用应用内浏览器检查 15 个路由**

运行：`npm run dev -- --host 127.0.0.1`。依次访问公共页、看板、六个分析页、岗位列表/详情和 AI 页；检查控制台错误、导航选中、筛选、分页、表单、AI 发送和 ECharts resize。

- [ ] **Step 4: 检查三种视口并修复视觉问题**

桌面使用约 `1440×1024`，窄桌面使用约 `1024×768`，移动端使用约 `390×844`。修复主内容裁切、侧栏遮挡、筛选溢出、表格不可滚动、图表标签重叠和按钮换行。

- [ ] **Step 5: 完成视觉忠实度台账**

在 `fidelity-ledger.md` 记录至少五项：导航宽度与颜色、页面标题层级、控件高度、表格行密度、图表配色、容器边框/圆角、响应式行为。每项包含概念证据、渲染证据和已修复差异或保留理由。

- [ ] **Step 6: 截图并执行最终图像对照**

保存最新浏览器截图，在同一次 QA 中对概念图和实现截图分别使用 `view_image`。确认没有管理端导航、没有硬编码重复列表、没有紫色/渐变、没有移动端横向页面溢出。

- [ ] **Step 7: 最终验证**

再次运行：`npm test && npm run build`。预期：退出码为 0；随后停止开发服务器并删除临时 QA 截图之外的调试产物。
