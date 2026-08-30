import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import * as Vue from 'vue'
import { dashboardMeta } from '../src/data/dashboard.js'
import { adminNavigation } from '../src/data/navigation.js'
import { navigationPresentation, toggleNavigationState } from '../src/utils/navigationState.js'

function destructureImport(specifiers) {
  return specifiers.split(',').map((item) => {
    const [imported, local = imported] = item.trim().split(/\s+as\s+/)
    return imported === local ? imported : `${imported}: ${local}`
  }).join(', ')
}

function compileAdminLayout() {
  const filename = 'src/layouts/AdminLayout.vue'
  const source = readFileSync(new URL('../src/layouts/AdminLayout.vue', import.meta.url), 'utf8')
  const { descriptor, errors } = parse(source, { filename })
  assert.deepEqual(errors, [])
  const script = compileScript(descriptor, { id: 'AdminLayout', genDefaultAs: '__sfc__' })
  const template = compileTemplate({
    source: descriptor.template.content,
    filename,
    id: 'AdminLayout',
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [])

  const replaceImports = (code) => code
    .replace(/^import \{([^}]+)\} from ['"]vue['"]\s*$/gm, (_, imports) => `const { ${destructureImport(imports)} } = Vue`)
    .replace(/^import \{([^}]+)\} from ['"]vue-router['"]\s*$/gm, (_, imports) => `const { ${destructureImport(imports)} } = Router`)
    .replace(/^import AppIcon from ['"]\.\.\/components\/AppIcon\.vue['"]\s*$/gm, 'const AppIcon = Components.AppIcon')
    .replace(/^import ConfirmDialog from ['"]\.\.\/components\/ConfirmDialog\.vue['"]\s*$/gm, 'const ConfirmDialog = Components.ConfirmDialog')
    .replace(/^import \{ dashboardMeta \} from ['"]\.\.\/data\/dashboard\.js['"]\s*$/gm, 'const { dashboardMeta } = Dependencies')
    .replace(/^import \{ adminNavigation \} from ['"]\.\.\/data\/navigation\.js['"]\s*$/gm, 'const { adminNavigation } = Dependencies')
    .replace(/^import \{ clearDemoSession, readDemoSession \} from ['"]\.\.\/utils\/demoSession\.js['"]\s*$/gm, 'const { clearDemoSession, readDemoSession } = Dependencies')
    .replace(/^import \{ navigationPresentation, toggleNavigationState \} from ['"]\.\.\/utils\/navigationState\.js['"]\s*$/gm, 'const { navigationPresentation, toggleNavigationState } = Dependencies')

  const executable = `${replaceImports(script.content)}\n${replaceImports(template.code).replace('export function render', 'function render')}\n__sfc__.render = render\nreturn __sfc__`
  const route = Vue.reactive({ fullPath: '/dashboard' })
  const RouterLink = {
    props: ['to'],
    setup: (props, { slots }) => () => Vue.h('a', { href: props.to }, slots.default?.()),
  }
  const RouterView = { setup: () => () => Vue.h('div') }
  const Router = {
    RouterLink,
    RouterView,
    useRoute: () => route,
    useRouter: () => ({ replace() {} }),
  }
  const Components = {
    AppIcon: { props: ['name'], setup: () => () => Vue.h('svg') },
    ConfirmDialog: { props: ['open'], setup: () => () => Vue.h('div') },
  }
  const Dependencies = {
    dashboardMeta,
    adminNavigation,
    clearDemoSession() {},
    readDemoSession: () => ({ username: '管理员' }),
    navigationPresentation,
    toggleNavigationState,
  }
  return new Function('Vue', 'Router', 'Components', 'Dependencies', executable)(Vue, Router, Components, Dependencies)
}

function descendants(node) {
  return node.children.flatMap((child) => [child, ...descendants(child)])
}

function findNode(node, predicate) {
  return [node, ...descendants(node)].find(predicate)
}

function createNode(type, document, text = '') {
  const node = {
    type,
    text,
    parent: null,
    children: [],
    props: {},
    focus() { document.activeElement = node },
    querySelector() {
      return descendants(node).find((child) => ['a', 'button'].includes(child.type) && !child.props.disabled)
    },
  }
  return node
}

function mount(Component, document) {
  const root = createNode('root', document)
  const renderer = Vue.createRenderer({
    patchProp(element, key, _previous, next) { element.props[key] = next },
    insert(child, parent, anchor) {
      child.parent = parent
      const index = anchor ? parent.children.indexOf(anchor) : -1
      parent.children.splice(index < 0 ? parent.children.length : index, 0, child)
    },
    remove(child) {
      if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1)
    },
    createElement: (type) => createNode(type, document),
    createText: (text) => createNode('#text', document, text),
    createComment: (text) => createNode('#comment', document, text),
    setText(node, text) { node.text = text },
    setElementText(node, text) { node.text = text; node.children = [] },
    parentNode: (node) => node.parent,
    nextSibling(node) { return node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null },
    querySelector: () => null,
  })
  const app = renderer.createApp(Component)
  app.mount(root)
  return { root, app }
}

test('mobile drawer moves focus, isolates workspace, closes on Escape, and restores focus', async () => {
  const previousWindow = globalThis.window
  const previousDocument = globalThis.document
  const document = { activeElement: null }
  globalThis.window = { innerWidth: 390, addEventListener() {}, removeEventListener() {} }
  globalThis.document = document

  try {
    const mounted = mount(compileAdminLayout(), document)
    const menu = findNode(mounted.root, (node) => node.type === 'button' && node.props['aria-controls'] === 'admin-navigation')
    const sidebar = findNode(mounted.root, (node) => node.type === 'aside')
    const workspace = findNode(mounted.root, (node) => node.props.class === 'admin-shell__workspace')
    const shell = findNode(mounted.root, (node) => typeof node.props.class === 'string' && node.props.class.includes('admin-shell'))

    menu.focus()
    menu.props.onClick()
    await Vue.nextTick()
    await Vue.nextTick()

    assert.equal(document.activeElement.type, 'a')
    assert.equal(sidebar.props.inert, undefined)
    assert.equal(sidebar.props['aria-hidden'], undefined)
    assert.equal(workspace.props.inert, '')
    assert.equal(workspace.props['aria-hidden'], 'true')

    const escape = { key: 'Escape', preventDefault() { this.prevented = true } }
    shell.props.onKeydown(escape)
    await Vue.nextTick()
    await Vue.nextTick()

    assert.equal(escape.prevented, true)
    assert.equal(document.activeElement, menu)
    assert.equal(sidebar.props.inert, '')
    assert.equal(sidebar.props['aria-hidden'], 'true')
    assert.equal(workspace.props.inert, undefined)
    assert.equal(workspace.props['aria-hidden'], undefined)
    mounted.app.unmount()
  } finally {
    globalThis.window = previousWindow
    globalThis.document = previousDocument
  }
})
