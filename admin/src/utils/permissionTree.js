export function collectPermissionIds(nodes) {
  return (nodes || []).flatMap((node) => node.permissionId == null
    ? collectPermissionIds(node.children)
    : [node.permissionId])
}

export function initialSelectedIds(nodes) {
  return (nodes || []).flatMap((node) => node.permissionId == null
    ? initialSelectedIds(node.children)
    : (node.checked ? [node.permissionId] : []))
}

export function nodeSelectionState(node, selectedIds) {
  const leafIds = collectPermissionIds([node])
  const selected = new Set(selectedIds)
  const selectedCount = leafIds.filter((id) => selected.has(id)).length
  if (selectedCount === 0) return 'unchecked'
  if (selectedCount === leafIds.length) return 'checked'
  return 'mixed'
}

export function toggleNodeSelection(selectedIds, node) {
  const selected = new Set(selectedIds)
  const leafIds = collectPermissionIds([node])
  const shouldSelect = leafIds.some((id) => !selected.has(id))
  leafIds.forEach((id) => shouldSelect ? selected.add(id) : selected.delete(id))
  return [...selected].sort((left, right) => left - right)
}

export function collectNodeKeys(nodes) {
  return (nodes || []).flatMap((node) => [node.key, ...collectNodeKeys(node.children)])
}
