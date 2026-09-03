export function toPermissionRows(permissions) {
  if (!Array.isArray(permissions)) return []
  return permissions.map((permission) => ({
    id: permission.id,
    name: permission.permissionName,
    code: permission.permissionCode,
  }))
}

export function toPermissionPayload(record) {
  const payload = {
    permissionName: record.name.trim(),
    permissionCode: record.code.trim(),
  }
  return record.id == null ? payload : { id: record.id, ...payload }
}
