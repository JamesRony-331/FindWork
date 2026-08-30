export function isDrawerViewport(viewportWidth) {
  return Number(viewportWidth) <= 720
}

export function toggleNavigationState(state, viewportWidth) {
  if (isDrawerViewport(viewportWidth)) {
    return { ...state, mobileOpen: !state.mobileOpen }
  }

  return { ...state, collapsed: !state.collapsed }
}

export function navigationPresentation(state, viewportWidth) {
  const drawer = isDrawerViewport(viewportWidth)
  const expanded = drawer ? state.mobileOpen : !state.collapsed

  return {
    expanded,
    labelsVisible: drawer || !state.collapsed,
    sidebarWidth: drawer || !state.collapsed ? 224 : 72,
  }
}
