export const loginFields = [
  { key: 'email', label: '邮箱', type: 'email', placeholder: '请输入邮箱' },
  { key: 'password', label: '密码', type: 'password', placeholder: '请输入密码' },
];
export const loginBenefits = ['多维岗位查询', '就业趋势分析', 'AI 就业辅助'];
export function createLoginForm() {
  return { email: '', password: '', remember: false };
}
export function validateLogin(form) {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = '请输入正确的邮箱地址';
  if (!form.password) errors.password = '请输入密码';
  return errors;
}

export function createLoginPayload(form) {
  return { email: form.email.trim(), password: form.password };
}
