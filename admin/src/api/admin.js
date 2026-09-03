import request from '../request/Request.js'

export function adminLogin(payload) {
  return request.post('/user/AdminLogin', payload)
}

export function getUserRoles() {
  return request.get('/rbac/getUserRole')
}

export function getRoleList() {
  return request.get('/rbac/getRoleList')
}

export function getPermissionTree(roleId) {
  return request.get('/rbac/getPermissionTree', { params: { roleId } })
}

export function insertRole(payload) {
  return request.post('/rbac/insertRole', payload)
}

export function updateRole(payload) {
  return request.post('/rbac/updateRole', payload)
}

export function getUserPermissions() {
  return request.get('/rbac/getUserPermission')
}

export function insertPermission(payload) {
  return request.post('/rbac/insertPermission', payload)
}

export function updatePermission(payload) {
  return request.post('/rbac/updatePermission', payload)
}

export function getUserMenus() {
  return request.get('/menu/getMenu')
}

export function getUsersByPage(payload) {
  return request.post('/user/getUserList', payload)
}

export function getRequestErrorMessage(error) {
  return error.response?.data?.info || error.message || '请求失败，请稍后重试'
}
