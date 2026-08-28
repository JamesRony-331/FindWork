export const loginFields = [{ key: 'username', label: '用户名', type: 'text', placeholder: '请输入用户名' }, { key: 'password', label: '密码', type: 'password', placeholder: '请输入密码' }]
export const roleOptions = [{ label: '普通用户', value: 'user' }, { label: '管理员', value: 'admin' }]
export const loginBenefits = ['多维岗位查询', '就业趋势分析', 'AI 就业辅助']
export function createLoginForm() { return { username: '', password: '', role: 'user', remember: false } }
export function validateLogin(form) { const errors = {}; if (!form.username.trim()) errors.username = '请输入用户名'; if (!form.password) errors.password = '请输入密码'; return errors }
export function handleLogin(form) { return { ok: Object.keys(validateLogin(form)).length === 0, redirect: form.role === 'admin' ? '/admin/dashboard' : '/user/dashboard' } }
