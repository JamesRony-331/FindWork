export const registerFields = [
  { key: 'nickname', label: '昵称', type: 'text', placeholder: '请输入 2–20 位昵称' },
  { key: 'email', label: '邮箱', type: 'email', placeholder: '请输入邮箱' },
  { key: 'password', label: '密码', type: 'password', placeholder: '请输入至少 8 位密码' },
  { key: 'confirmPassword', label: '确认密码', type: 'password', placeholder: '请再次输入密码' },
];
export function createRegisterForm() {
  return { nickname: '', email: '', password: '', confirmPassword: '' };
}
export function validateRegister(form) {
  const errors = {};
  const nicknameLength = form.nickname.trim().length;
  if (nicknameLength < 2 || nicknameLength > 20) errors.nickname = '昵称需为 2–20 个字符';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = '请输入正确的邮箱地址';
  if (form.password.length < 8) errors.password = '密码长度不能少于 8 位';
  if (form.confirmPassword !== form.password) errors.confirmPassword = '两次输入的密码不一致';
  return errors;
}

export function createRegisterPayload(form) {
  return {
    nickname: form.nickname.trim(),
    email: form.email.trim(),
    password: form.password,
  };
}
