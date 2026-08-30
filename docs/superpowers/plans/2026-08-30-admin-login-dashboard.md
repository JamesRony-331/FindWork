# Admin Login and Data Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished static administrator login flow and recruitment-data dashboard in the existing Vue 3 admin application.

**Architecture:** Keep `App.vue` as the router outlet, use a dedicated admin layout for navigation chrome, and keep all demonstration content in a single data module so API data can replace it later. Small focused components render metrics, charts, status rows, tables, and the confirmation dialog; route metadata and a local demo session provide the temporary authentication flow.

**Tech Stack:** Vue 3, Vue Router, Vite, native CSS, SVG, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-30-admin-login-dashboard-design.md`

## Global Constraints

- Preserve the existing Vue 3 + Vite project and the installed Vue Router dependency.
- Do not connect to or change backend APIs in this phase.
- Keep all dashboard values in `admin/src/data/dashboard.js` and label them as demonstration data in the UI.
- Do not introduce Element Plus, a charting library, or other new runtime dependencies.
- Do not use browser `alert` or `confirm`.
- Use `#087F7A` as the primary accent, `#093B4B` for navigation, and `#F3F7F8` for the page background.
- Use restrained borders, 6px control radii, 10px panel radii, and no glassmorphism, glow, or purple/blue gradients.
- Support 1440px, 1024px, and 390px viewports and `prefers-reduced-motion`.
- Do not modify `client/` or `service/`.

---

### Task 1: Produce and approve the visual specification

**Files:**
- Create: `docs/design-concepts/admin-login-concept.png`
- Create: `docs/design-concepts/admin-dashboard-concept.png`
- Create: `docs/design-concepts/admin-fidelity-ledger.md`

**Interfaces:**
- Consumes: the approved design spec and its exact palette, content hierarchy, and layout constraints.
- Produces: two accepted desktop concept images that all implementation tasks must match exactly.

- [ ] **Step 1: Generate the complete login concept**

Use Image Gen with a 1440px desktop application screenshot prompt. Require a 58/42 split layout, deep teal editorial data visual on the left, a code-native-looking 400px login form on white at right, Chinese copy from the spec, no floating card, no gradients, and no decorative badge above the heading.

- [ ] **Step 2: Generate the complete dashboard concept**

Use Image Gen with a 1440px desktop dashboard screenshot prompt. Require a 224px deep-teal sidebar, 64px white header, four compact metric panels, seven-day trend, source share, city bars, quality overview, task table, recent activity, and visible demonstration-data labeling.

- [ ] **Step 3: Inspect both concepts directly**

Run `view_image` on both PNG files. Reject and regenerate any concept containing illegible text, fake browser chrome, excessive rounded cards, nested panels, large shadows, gradients, glow, clipped content, or a different navigation order.

- [ ] **Step 4: Obtain explicit user approval**

Show both images to the user and stop. Do not begin Task 2 until the user explicitly approves the visual concepts.

- [ ] **Step 5: Record the accepted visual inventory**

Create `docs/design-concepts/admin-fidelity-ledger.md` with this table and fill every cell from direct image inspection:

```markdown
| Area | Accepted concept evidence | Implementation evidence | Fix or deviation |
| --- | --- | --- | --- |
| Login composition | | | |
| Dashboard shell | | | |
| Typography | | | |
| Palette and borders | | | |
| Charts and data density | | | |
| Responsive behavior | | | |
```

- [ ] **Step 6: Commit the accepted visual specification**

```bash
git add -- docs/design-concepts/admin-login-concept.png docs/design-concepts/admin-dashboard-concept.png docs/design-concepts/admin-fidelity-ledger.md
git commit -m "docs: add admin interface concepts"
```

### Task 2: Establish the design system and application shell

**Files:**
- Modify: `admin/src/App.vue`
- Modify: `admin/src/main.js`
- Modify: `admin/src/style.css`
- Create: `admin/src/styles/tokens.css`
- Create: `admin/src/styles/base.css`
- Create: `admin/src/styles/components.css`
- Delete: `admin/src/components/HelloWorld.vue`
- Delete: `admin/src/assets/vue.svg`
- Delete: `admin/public/vite.svg`
- Test: `admin/tests/designSystem.test.js`

**Interfaces:**
- Consumes: accepted concept colors, radii, spacing, typography, and focus treatment.
- Produces: CSS custom properties `--color-primary`, `--color-nav`, `--color-page`, `--color-text`, `--color-muted`, `--color-border`, `--color-success`, `--color-warning`, and `--color-danger`; shared `.panel`, `.button`, `.field`, `.status`, and `.sr-only` primitives.

- [ ] **Step 1: Write the design-token contract test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('admin design tokens expose the approved palette and radii', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')
  assert.match(css, /--color-primary:\s*#087f7a/i)
  assert.match(css, /--color-nav:\s*#093b4b/i)
  assert.match(css, /--radius-control:\s*6px/)
  assert.match(css, /--radius-panel:\s*10px/)
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `cd admin && node --test tests/designSystem.test.js`

Expected: FAIL because `src/styles/tokens.css` does not exist.

- [ ] **Step 3: Create the shared CSS files**

Define the exact variables from the spec in `tokens.css`; reset margins, box sizing, typography, buttons, inputs, and focus rings in `base.css`; implement the shared primitives in `components.css`. Add a reduced-motion media query that sets transition and animation duration to `0.01ms`.

- [ ] **Step 4: Reduce App to composition glue**

Use this complete template:

```vue
<template>
  <RouterView />
</template>
```

Import `RouterView`, install the router in `main.js`, and import tokens, base, and component CSS in that order. Replace the starter `style.css` contents with imports only.

- [ ] **Step 5: Remove starter assets and run verification**

Run: `cd admin && node --test tests/designSystem.test.js && npm run build`

Expected: PASS and a successful Vite build with no missing starter asset.

- [ ] **Step 6: Commit**

```bash
git add -- admin/src admin/public admin/tests
git commit -m "style: establish admin design system"
```

### Task 3: Add static data and pure presentation helpers

**Files:**
- Create: `admin/src/data/dashboard.js`
- Create: `admin/src/utils/dashboard.js`
- Test: `admin/tests/dashboardData.test.js`

**Interfaces:**
- Produces: named exports `dashboardMeta`, `metrics`, `collectionTrend`, `sourceShare`, `cityRanking`, `qualitySummary`, `collectionTasks`, `recentActivities`, and `alerts`.
- Produces: `toPolylinePoints(values, width, height, padding)` returning an SVG point string and `toPercent(value, total)` returning a clamped number from 0 to 100.

- [ ] **Step 1: Write failing helper and data tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { metrics, collectionTrend, collectionTasks } from '../src/data/dashboard.js'
import { toPercent, toPolylinePoints } from '../src/utils/dashboard.js'

test('dashboard demonstration datasets have stable identifiers', () => {
  assert.equal(metrics.length, 4)
  assert.equal(collectionTrend.length, 7)
  assert.ok(metrics.every((item) => item.id && item.label && Number.isFinite(item.value)))
  assert.ok(collectionTasks.every((item) => item.id && item.status))
})

test('chart helpers clamp percentages and create SVG points', () => {
  assert.equal(toPercent(25, 100), 25)
  assert.equal(toPercent(120, 100), 100)
  assert.match(toPolylinePoints([10, 20, 15], 300, 120, 12), /^\d+(\.\d+)?,\d+(\.\d+)?/)
})
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `cd admin && node --test tests/dashboardData.test.js`

Expected: FAIL because both modules are missing.

- [ ] **Step 3: Implement the static data module**

Use Chinese labels matching the spec. Each record must have a stable `id`; task status values are exactly `running`, `success`, `warning`, or `failed`. Add `dashboardMeta.isDemo = true` and an explicit update timestamp.

- [ ] **Step 4: Implement the pure helpers**

`toPercent` returns `0` for an invalid or zero total and clamps valid ratios. `toPolylinePoints` maps minimum and maximum values into the padded SVG plot region and handles a one-value array without division by zero.

- [ ] **Step 5: Run tests and commit**

Run: `cd admin && node --test tests/dashboardData.test.js`

```bash
git add -- admin/src/data/dashboard.js admin/src/utils/dashboard.js admin/tests/dashboardData.test.js
git commit -m "feat: add admin dashboard demonstration data"
```

### Task 4: Add the static authentication flow and routes

**Files:**
- Create: `admin/src/router/index.js`
- Create: `admin/src/utils/demoSession.js`
- Create: `admin/src/views/LoginView.vue`
- Test: `admin/tests/demoSession.test.js`
- Test: `admin/tests/router.test.js`

**Interfaces:**
- Produces: `createDemoSession(username, remember)`, `readDemoSession()`, `clearDemoSession()`, and `isDemoAuthenticated()`.
- Produces routes `/login` named `AdminLogin` and `/dashboard` named `AdminDashboard` with `/` redirecting according to session state.

- [ ] **Step 1: Write the session contract test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryStorage, createDemoSessionStore } from '../src/utils/demoSession.js'

test('demo session can be created, read, and cleared', () => {
  const storage = createMemoryStorage()
  const session = createDemoSessionStore(storage)
  session.create('admin', true)
  assert.deepEqual(session.read(), { username: 'admin', remember: true })
  session.clear()
  assert.equal(session.read(), null)
})
```

- [ ] **Step 2: Write the route contract test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { routes } from '../src/router/index.js'

test('admin routes expose login and dashboard only', () => {
  assert.ok(routes.some((route) => route.path === '/login'))
  assert.ok(routes.some((route) => route.path === '/dashboard'))
  assert.equal(routes.filter((route) => route.meta?.requiresAuth).length, 1)
})
```

- [ ] **Step 3: Run both tests and verify failure**

Run: `cd admin && node --test tests/demoSession.test.js tests/router.test.js`

Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Implement demo session and router**

Store only `{ username, remember }` under `goworking-admin-demo-session`. Use `localStorage` when remembered and `sessionStorage` otherwise. The navigation guard sends unauthenticated dashboard access to `/login` and authenticated login access to `/dashboard`.

- [ ] **Step 5: Implement LoginView to match the accepted concept**

Use code-native labels `管理员账号`, `密码`, `记住登录状态`, and `登录管理端`. Validate both fields on submit, render inline error text with `aria-live="polite"`, toggle password visibility, create the demo session, then call `router.replace('/dashboard')`.

- [ ] **Step 6: Run tests, build, and commit**

Run: `cd admin && node --test tests/demoSession.test.js tests/router.test.js && npm run build`

```bash
git add -- admin/src/router admin/src/utils/demoSession.js admin/src/views/LoginView.vue admin/tests
git commit -m "feat: add static admin login flow"
```

### Task 5: Build reusable dashboard visualization components

**Files:**
- Create: `admin/src/components/AppIcon.vue`
- Create: `admin/src/components/MetricCard.vue`
- Create: `admin/src/components/TrendChart.vue`
- Create: `admin/src/components/SourceDonut.vue`
- Create: `admin/src/components/HorizontalBars.vue`
- Create: `admin/src/components/QualityOverview.vue`
- Create: `admin/src/components/StatusTag.vue`
- Create: `admin/src/components/ConfirmDialog.vue`
- Test: `admin/tests/componentContracts.test.js`

**Interfaces:**
- `MetricCard` consumes `{ metric }`.
- `TrendChart` consumes `{ rows, title }`.
- `SourceDonut` consumes `{ rows, title }`.
- `HorizontalBars` consumes `{ rows, title }`.
- `QualityOverview` consumes `{ rows, title }`.
- `StatusTag` consumes `{ status, label }`.
- `ConfirmDialog` consumes `{ open, title, message }` and emits `confirm` and `cancel`.

- [ ] **Step 1: Write component source contract tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = (name) => readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8')

test('dashboard components expose accessible labels and reduced-motion hooks', () => {
  assert.match(source('TrendChart.vue'), /aria-label/)
  assert.match(source('SourceDonut.vue'), /aria-label/)
  assert.match(source('ConfirmDialog.vue'), /role="dialog"/)
  assert.match(source('ConfirmDialog.vue'), /aria-modal="true"/)
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `cd admin && node --test tests/componentContracts.test.js`

Expected: FAIL because the component files are missing.

- [ ] **Step 3: Implement icon, metric, and status primitives**

Create a single `AppIcon` component with consistent 20px `currentColor` SVG symbols for dashboard, user, briefcase, collection, clean, dictionary, log, menu, clock, and logout. Use `MetricCard` and `StatusTag` for all repeated indicator anatomy and exact status colors from the spec.

- [ ] **Step 4: Implement chart components**

Use SVG for the trend polyline and CSS conic-gradient only for the source donut. Use semantic lists beside charts so every value remains readable without color. Horizontal bars use percentage widths computed by `toPercent`; all animations stop under reduced motion.

- [ ] **Step 5: Implement quality and confirmation components**

Quality rows show label, percentage, and progress track. ConfirmDialog traps the visual focus in a centered modal surface, closes on Escape, restores focus to the opener, and emits no browser dialog calls.

- [ ] **Step 6: Run tests, build, and commit**

Run: `cd admin && node --test tests/componentContracts.test.js && npm run build`

```bash
git add -- admin/src/components admin/tests/componentContracts.test.js
git commit -m "feat: add admin dashboard components"
```

### Task 6: Implement the admin layout and dashboard composition

**Files:**
- Create: `admin/src/data/navigation.js`
- Create: `admin/src/layouts/AdminLayout.vue`
- Create: `admin/src/views/DashboardView.vue`
- Create: `admin/src/styles/responsive.css`
- Modify: `admin/src/style.css`
- Modify: `admin/src/router/index.js`
- Test: `admin/tests/navigation.test.js`
- Test: `admin/tests/dashboardView.test.js`

**Interfaces:**
- Consumes all Task 3 datasets and Task 5 components.
- Produces a responsive shell with `collapsed` and `mobileOpen` local state and a dashboard route nested under `AdminLayout`.

- [ ] **Step 1: Write navigation and page composition tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { adminNavigation } from '../src/data/navigation.js'
import { readFileSync } from 'node:fs'

test('admin navigation follows the approved order', () => {
  assert.deepEqual(adminNavigation.map((item) => item.label), [
    '数据大屏', '用户管理', '岗位数据', '采集管理', '数据清洗', '字典管理', '系统日志'
  ])
})

test('dashboard includes every approved data region', () => {
  const view = readFileSync(new URL('../src/views/DashboardView.vue', import.meta.url), 'utf8')
  for (const label of ['近七日采集趋势', '数据来源', '热门城市', '数据质量', '采集任务', '最近操作']) {
    assert.match(view, new RegExp(label))
  }
})
```

- [ ] **Step 2: Run tests and verify failure**

Run: `cd admin && node --test tests/navigation.test.js tests/dashboardView.test.js`

Expected: FAIL because navigation, layout, and dashboard are missing.

- [ ] **Step 3: Implement navigation and AdminLayout**

Only `数据大屏` navigates. Other menu items render as disabled with visible `待建设` text. Implement the 224px/72px sidebar, 64px header, breadcrumbs, demonstration update time, administrator menu, responsive mobile drawer, and logout confirmation.

- [ ] **Step 4: Compose DashboardView**

Render the page header, four metrics, two-column primary chart row, two-column secondary chart row, task table, alert summary, and recent activities in the accepted concept order. Tables use compact rows, sticky headers only when needed, and horizontal overflow at 390px.

- [ ] **Step 5: Add responsive rules**

At 1100px collapse the sidebar and reduce the primary chart span. At 720px switch to mobile navigation, two-column metrics, one-column charts, and horizontally scrollable tables. At 480px allow one-column metrics only when labels would otherwise clip.

- [ ] **Step 6: Run all tests and build**

Run: `cd admin && node --test && npm run build`

Expected: all tests PASS and Vite reports a successful production build.

- [ ] **Step 7: Commit**

```bash
git add -- admin/src admin/tests
git commit -m "feat: build admin recruitment data dashboard"
```

### Task 7: Browser fidelity and interaction verification

**Files:**
- Modify: `admin/src/**/*.vue` only for verified mismatches
- Modify: `admin/src/styles/*.css` only for verified mismatches
- Modify: `docs/design-concepts/admin-fidelity-ledger.md`

**Interfaces:**
- Consumes: the accepted concept images and the complete implementation.
- Produces: verified desktop and mobile screenshots and a completed fidelity ledger with no unresolved fixable mismatch.

- [ ] **Step 1: Start the admin application**

Run: `cd admin && npm run dev -- --host 127.0.0.1`

Expected: Vite serves the admin app on a local port.

- [ ] **Step 2: Verify the login workflow in the in-app Browser**

Open `/login`; submit empty fields and confirm inline errors; toggle password visibility; enter a username and password; log in; confirm navigation to `/dashboard`. Capture a 1440px login screenshot before submitting.

- [ ] **Step 3: Verify dashboard interactions**

Collapse and expand the sidebar, inspect every chart label, open logout confirmation, cancel it, reopen and confirm logout, then confirm return to `/login`. Capture a 1440px dashboard screenshot.

- [ ] **Step 4: Verify responsive layouts**

Inspect 1024px and 390px widths. Confirm no primary content clipping, no accidental heading wrapping, usable mobile navigation, readable chart legends, and horizontally scrollable tables.

- [ ] **Step 5: Compare concept and implementation directly**

Run `view_image` on each accepted concept and its latest corresponding browser screenshot in the same QA pass. Compare copy, composition, typography, palette, borders, radii, charts, icon treatment, spacing, density, and responsive behavior. Fix every concrete mismatch that would receive design-review feedback.

- [ ] **Step 6: Complete the fidelity ledger**

Fill the implementation evidence and fix/deviation columns for all six rows. Run an above-the-fold copy diff and record whether any visible copy was added, removed, renamed, or reordered. No remaining deviation may be omitted.

- [ ] **Step 7: Run final verification and commit**

Run: `cd admin && node --test && npm run build`

```bash
git add -- admin/src admin/tests docs/design-concepts/admin-fidelity-ledger.md
git commit -m "fix: polish admin dashboard fidelity"
```

### Task 8: Final repository review

**Files:**
- Review only: `admin/`, `docs/design-concepts/`, and the implementation commits

**Interfaces:**
- Produces: a clean working tree and a handoff containing exact verification evidence.

- [ ] **Step 1: Inspect the complete diff and status**

Run: `git status --short` and `git diff HEAD~4..HEAD --stat`.

Expected: no unexpected changes outside `admin/` and the approved design documentation.

- [ ] **Step 2: Confirm prohibited patterns are absent**

Run: `rg -n 'alert\(|confirm\(|linear-gradient|backdrop-filter' admin/src || true`.

Expected: no browser dialog, generic gradient, or glassmorphism usage.

- [ ] **Step 3: Report completion evidence**

Include the accepted concept paths, Browser verification workflow, desktop and mobile viewports checked, `view_image` comparison result, at least five fidelity comparison points, above-the-fold copy diff result, material mismatches fixed, core interaction result, final test/build output, and any intentional deviation.
