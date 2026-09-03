function normalizeParentId(parentId) {
  return parentId == null ? '0' : String(parentId)
}

export function buildAdminNavigation(rows) {
  if (!Array.isArray(rows)) return []

  const items = rows
    .filter((row) => row && row.menuId != null && row.menuName && row.path)
    .map((row) => ({
      id: String(row.menuId),
      parentId: normalizeParentId(row.parentId),
      label: row.menuName,
      icon: row.icon || 'menu',
      to: row.path,
      sortOrder: Number.isFinite(Number(row.sortOrder)) ? Number(row.sortOrder) : 0,
      children: [],
    }))

  const byId = new Map(items.map((item) => [item.id, item]))
  const roots = []

  for (const item of items) {
    if (item.parentId === '0') roots.push(item)
    else byId.get(item.parentId)?.children.push(item)
  }

  const sortTree = (entries) => entries
    .sort((left, right) => left.sortOrder - right.sortOrder || Number(left.id) - Number(right.id))
    .map(({ parentId, sortOrder, ...item }) => ({ ...item, children: sortTree(item.children) }))

  return sortTree(roots)
}
