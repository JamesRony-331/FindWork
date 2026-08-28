export const profileFields = [{ label: '用户名', value: 'student_demo' }, { label: '用户角色', value: '普通用户' }, { label: '联系方式', value: '138****8000' }, { label: '注册时间', value: '2025-03-18 10:20' }]
export const passwordFields = [{ key: 'currentPassword', label: '当前密码', placeholder: '请输入当前密码' }, { key: 'newPassword', label: '新密码', placeholder: '请输入至少 8 位新密码' }, { key: 'confirmPassword', label: '确认新密码', placeholder: '请再次输入新密码' }]
export function createPasswordForm() { return { currentPassword: '', newPassword: '', confirmPassword: '' } }
export function validatePasswordChange(form) { const errors = {}; if (!form.currentPassword) errors.currentPassword = '请输入当前密码'; if (form.newPassword.length < 8) errors.newPassword = '新密码长度不能少于 8 位'; if (form.newPassword !== form.confirmPassword) errors.confirmPassword = '两次输入的新密码不一致'; return errors }
export function handlePasswordChange(form) { return { ok: Object.keys(validatePasswordChange(form)).length === 0 } }
