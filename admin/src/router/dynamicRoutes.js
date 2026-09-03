function isInternalPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
}

export function buildDynamicRouteRecords(rows, componentLoaders) {
  if (!Array.isArray(rows) || !componentLoaders) return []

  const menusById = new Map(rows.filter(Boolean).map((row) => [String(row.menuId), row]))
  const paths = new Set()
  const names = new Set()
  const records = []

  for (const row of rows) {
    if (!row || String(row.menuType).toUpperCase() !== 'C') continue
    if (!isInternalPath(row.path) || !row.routeName || !row.component || !row.menuName) continue

    const component = componentLoaders[row.component]
    if (!component || paths.has(row.path) || names.has(row.routeName)) continue

    paths.add(row.path)
    names.add(row.routeName)
    const parent = menusById.get(String(row.parentId))
    const meta = {
      requiresAuth: true,
      title: row.menuName,
      icon: row.icon || 'menu',
      menuId: row.menuId,
    }
    if (parent?.menuName) meta.section = parent.menuName

    records.push({
      path: row.path,
      name: row.routeName,
      component,
      meta,
    })
  }

  return records
}
