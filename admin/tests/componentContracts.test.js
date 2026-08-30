import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import * as Vue from 'vue'
import { toPercent, toPolylinePoints } from '../src/utils/dashboard.js'

const source = (name) => readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8')
const dashboardUtils = { toPercent, toPolylinePoints }

function destructureImport(specifiers) {
  return specifiers.split(',').map((item) => {
    const [imported, local = imported] = item.trim().split(/\s+as\s+/)
    return imported === local ? imported : `${imported}: ${local}`
  }).join(', ')
}

function compileComponent(name) {
  const filename = `src/components/${name}`
  const { descriptor, errors } = parse(source(name), { filename })
  assert.deepEqual(errors, [], `${name} should parse as an SFC`)

  const script = compileScript(descriptor, { id: name, genDefaultAs: '__sfc__' })
  const template = compileTemplate({
    source: descriptor.template.content,
    filename,
    id: name,
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [], `${name} should compile its template`)

  const replaceImports = (code) => code
    .replace(/^import \{([^}]+)\} from ['"]vue['"]\s*$/gm, (_, imports) => `const { ${destructureImport(imports)} } = Vue`)
    .replace(/^import \{([^}]+)\} from ['"]\.\.\/utils\/dashboard\.js['"]\s*$/gm, (_, imports) => `const { ${destructureImport(imports)} } = DashboardUtils`)

  const executable = `${replaceImports(script.content)}\n${replaceImports(template.code).replace('export function render', 'function render')}\n__sfc__.render = render\nreturn __sfc__`
  return new Function('Vue', 'DashboardUtils', executable)(Vue, dashboardUtils)
}

function createNode(type, text = '') {
  const node = {
    type,
    text,
    parent: null,
    children: [],
    props: {},
    focus() {
      globalThis.document.activeElement = node
    },
    querySelectorAll() {
      return descendants(node).filter((child) => ['button', 'a', 'input', 'select', 'textarea'].includes(child.type) && !child.props.disabled)
    },
  }

  return node
}

function descendants(node) {
  return node.children.flatMap((child) => [child, ...descendants(child)])
}

function findNode(node, predicate) {
  return [node, ...descendants(node)].find(predicate)
}

function nodeText(node) {
  return `${node.text}${node.children.map(nodeText).join('')}`
}

function createTestRenderer(portalTarget) {
  return Vue.createRenderer({
    patchProp(element, key, _previous, next) {
      element.props[key] = next
    },
    insert(child, parent, anchor) {
      if (child.parent) {
        child.parent.children.splice(child.parent.children.indexOf(child), 1)
      }
      child.parent = parent
      const index = anchor ? parent.children.indexOf(anchor) : -1
      parent.children.splice(index < 0 ? parent.children.length : index, 0, child)
    },
    remove(child) {
      if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
      child.parent = null
    },
    createElement: (type) => createNode(type),
    createText: (text) => createNode('#text', text),
    createComment: (text) => createNode('#comment', text),
    setText(node, text) {
      node.text = text
    },
    setElementText(node, text) {
      node.text = text
      node.children = []
    },
    parentNode: (node) => node.parent,
    nextSibling(node) {
      const siblings = node.parent?.children ?? []
      return siblings[siblings.indexOf(node) + 1] ?? null
    },
    querySelector: (selector) => selector === 'body' ? portalTarget : null,
  })
}

function mount(Component, props) {
  const root = createNode('root')
  const portalTarget = createNode('body')
  const renderer = createTestRenderer(portalTarget)
  const app = renderer.createApp({ render: () => Vue.h(Component, props) })
  app.mount(root)
  return { root, portalTarget, app }
}

test('dashboard sources retain supplementary accessibility contracts', () => {
  assert.match(source('TrendChart.vue'), /aria-label/)
  assert.match(source('SourceDonut.vue'), /aria-label/)
  assert.match(source('ConfirmDialog.vue'), /role="dialog"/)
  assert.match(source('ConfirmDialog.vue'), /aria-modal="true"/)
})

test('icon, metric card, and status tag render their prop-driven indicators', () => {
  const AppIcon = compileComponent('AppIcon.vue')
  const MetricCard = compileComponent('MetricCard.vue')
  const StatusTag = compileComponent('StatusTag.vue')

  const icon = mount(AppIcon, { name: 'dashboard' })
  assert.equal(findNode(icon.root, (node) => node.type === 'svg').props.class, 'app-icon')
  assert.equal(descendants(icon.root).filter((node) => node.type === 'rect').length, 4)

  const metric = mount(MetricCard, { metric: { label: '岗位数', value: 12480, unit: '条', change: -4.2, changeLabel: '较昨日' } })
  assert.match(nodeText(metric.root), /岗位数12,480条↓ 4.2% 较昨日/)

  const status = mount(StatusTag, { status: 'failed', label: '执行失败' })
  const tag = findNode(status.root, (node) => node.props.class === 'status status--danger')
  assert.equal(tag.props['aria-label'], '状态：执行失败')
})

test('trend chart handles empty, single, and flat series without hiding values', () => {
  const TrendChart = compileComponent('TrendChart.vue')

  const empty = mount(TrendChart, { title: '趋势', rows: [] })
  assert.equal(findNode(empty.root, (node) => node.type === 'polyline').props.points, '')

  const single = mount(TrendChart, { title: '趋势', rows: [{ id: 'one', label: '08-30', value: 12 }] })
  assert.equal(findNode(single.root, (node) => node.type === 'polyline').props.points, '160,78')
  assert.match(nodeText(single.root), /08-3012/)

  const flat = mount(TrendChart, { title: '趋势', rows: [{ id: 'a', label: 'A', value: 3 }, { id: 'b', label: 'B', value: 3 }] })
  assert.equal(findNode(flat.root, (node) => node.type === 'polyline').props.points, '18,78 302,78')
})

test('source donut normalizes zero, negative, and non-finite source values', () => {
  const SourceDonut = compileComponent('SourceDonut.vue')
  const donut = mount(SourceDonut, {
    title: '数据来源',
    rows: [
      { id: 'a', label: 'A', value: 10 },
      { id: 'b', label: 'B', value: 10 },
      { id: 'negative', label: '负数', value: -5 },
      { id: 'non-finite', label: '无效', value: Infinity },
    ],
  })
  const chart = findNode(donut.root, (node) => node.props.class === 'source-donut__chart')
  assert.match(nodeText(donut.root), /20总计/)
  assert.match(nodeText(donut.root), /A50.0%B50.0%负数0.0%无效0.0%/)
  assert.doesNotMatch(chart.props.style.background, /(?:1\d\d|[2-9]\d)\d?\.\d+%/)
  assert.match(chart.props.style.background, /100%/)

  const emptyDonut = mount(SourceDonut, { title: '数据来源', rows: [{ id: 'zero', label: '零', value: 0 }] })
  assert.match(nodeText(emptyDonut.root), /0总计零0.0%/)
  assert.doesNotMatch(findNode(emptyDonut.root, (node) => node.props.class === 'source-donut__chart').props.style.background, /-\d|\d{3,}%/)
})

test('horizontal bars and quality overview use clamped percentages from props', () => {
  const HorizontalBars = compileComponent('HorizontalBars.vue')
  const QualityOverview = compileComponent('QualityOverview.vue')

  const bars = mount(HorizontalBars, { title: '城市', rows: [{ id: 'top', label: '杭州', value: 20 }, { id: 'next', label: '上海', value: 10 }] })
  const fills = descendants(bars.root).filter((node) => node.props.class === 'horizontal-bars__fill')
  assert.deepEqual(fills.map((node) => node.props.style.width), ['100%', '50%'])

  const quality = mount(QualityOverview, { title: '质量', rows: [{ id: 'high', label: '完整率', value: 120 }, { id: 'low', label: '准确率', value: -4 }] })
  const tracks = descendants(quality.root).filter((node) => node.props.class === 'quality-overview__track')
  assert.deepEqual(tracks.map((node) => node.props['aria-valuenow']), [100, 0])
})

test('initially open confirmation dialog traps focus, emits events, and restores its opener', async () => {
  const ConfirmDialog = compileComponent('ConfirmDialog.vue')
  const previousDocument = globalThis.document
  const opener = createNode('button')
  const document = { activeElement: opener }
  globalThis.document = document
  const open = Vue.ref(true)
  const events = []
  const root = createNode('root')
  const portalTarget = createNode('body')
  const renderer = createTestRenderer(portalTarget)
  const app = renderer.createApp({
    setup: () => () => Vue.h(ConfirmDialog, {
      open: open.value,
      title: '确认退出',
      message: '确定要退出吗？',
      onConfirm: () => events.push('confirm'),
      onCancel: () => events.push('cancel'),
    }),
  })

  try {
    app.mount(root)
    await Vue.nextTick()
    await Vue.nextTick()

    const dialog = findNode(portalTarget, (node) => node.props.role === 'dialog')
    const buttons = dialog.querySelectorAll('button')
    assert.equal(document.activeElement, buttons[0])

    document.activeElement = buttons.at(-1)
    const tabForward = { key: 'Tab', shiftKey: false, preventDefault() { this.prevented = true } }
    dialog.props.onKeydown(tabForward)
    assert.equal(tabForward.prevented, true)
    assert.equal(document.activeElement, buttons[0])

    document.activeElement = buttons[0]
    const tabBackward = { key: 'Tab', shiftKey: true, preventDefault() { this.prevented = true } }
    dialog.props.onKeydown(tabBackward)
    assert.equal(tabBackward.prevented, true)
    assert.equal(document.activeElement, buttons.at(-1))

    dialog.props.onKeydown({ key: 'Escape', preventDefault() {} })
    buttons.at(-1).props.onClick()
    assert.deepEqual(events, ['cancel', 'confirm'])

    open.value = false
    await Vue.nextTick()
    assert.equal(document.activeElement, opener)
  } finally {
    app.unmount()
    globalThis.document = previousDocument
  }
})
