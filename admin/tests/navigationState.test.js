import test from 'node:test'
import assert from 'node:assert/strict'
import { navigationPresentation, toggleNavigationState } from '../src/utils/navigationState.js'

test('tablet navigation toggles between collapsed and expanded presentations', () => {
  const collapsed = { collapsed: true, mobileOpen: false }

  assert.deepEqual(navigationPresentation(collapsed, 900), {
    expanded: false,
    labelsVisible: false,
    sidebarWidth: 72,
  })

  const expanded = toggleNavigationState(collapsed, 900)
  assert.deepEqual(expanded, { collapsed: false, mobileOpen: false })
  assert.deepEqual(navigationPresentation(expanded, 900), {
    expanded: true,
    labelsVisible: true,
    sidebarWidth: 224,
  })
})

test('mobile navigation toggles drawer state without changing collapse preference', () => {
  const closed = { collapsed: true, mobileOpen: false }
  const open = toggleNavigationState(closed, 390)

  assert.deepEqual(open, { collapsed: true, mobileOpen: true })
  assert.equal(navigationPresentation(open, 390).expanded, true)
})
