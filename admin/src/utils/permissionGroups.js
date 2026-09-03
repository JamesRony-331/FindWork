const GROUPS = [
  { id: 'super', label: '核心权限', matches: (code) => code === '*:*:*' },
  { id: 'menu', label: '菜单管理', matches: (code) => code.startsWith('system:menu:') },
  { id: 'role-permission', label: '角色权限', matches: (code) => code.startsWith('system:role:permission:') },
  { id: 'role', label: '角色管理', matches: (code) => code.startsWith('system:role:') },
  { id: 'permission', label: '权限管理', matches: (code) => code.startsWith('system:permission:') },
  { id: 'user-role', label: '用户角色', matches: (code) => code.startsWith('system:user:role:') },
  { id: 'access', label: '访问权限', matches: (code) => ['admin:', 'dashboard:', 'profile:'].some((prefix) => code.startsWith(prefix)) },
  { id: 'other', label: '其他权限', matches: () => true },
]

export function groupPermissions(permissions, keyword = '') {
  const query = keyword.trim().toLowerCase()
  const filtered = Array.isArray(permissions) ? permissions.filter((permission) => {
    const content = `${permission?.permissionName ?? ''} ${permission?.permissionCode ?? ''}`.toLowerCase()
    return permission?.permissionCode && (!query || content.includes(query))
  }) : []

  const grouped = new Map(GROUPS.map((group) => [group.id, []]))
  for (const permission of filtered) {
    const group = GROUPS.find((candidate) => candidate.matches(permission.permissionCode))
    grouped.get(group.id).push(permission)
  }

  return GROUPS
    .map(({ id, label }) => ({ id, label, permissions: grouped.get(id) }))
    .filter((group) => group.permissions.length)
}
