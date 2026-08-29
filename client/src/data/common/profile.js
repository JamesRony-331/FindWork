const sexLabels = { 1: '男', 2: '女' };

export function readStoredUser(storage) {
  try {
    return JSON.parse(storage.getItem('userInfo')) || {};
  } catch {
    return {};
  }
}

export function createProfileFields(user) {
  return [
    { label: '昵称', value: user.nickname || '未设置' },
    { label: '邮箱', value: user.email || '未设置' },
    { label: '性别', value: sexLabels[user.sex] || '未设置' },
  ];
}

export function createProfileForm(user) {
  return { nickname: user.nickname || '', sex: user.sex ?? 0 };
}

export function validateProfile(form) {
  const errors = {};
  const nickname = form.nickname.trim();
  if (!nickname) errors.nickname = '请输入昵称';
  else if (nickname.length > 20) errors.nickname = '昵称不能超过 20 个字符';
  if (![0, 1, 2].includes(Number(form.sex))) errors.sex = '请选择正确的性别';
  return errors;
}

export function createProfilePayload(form) {
  return { nickname: form.nickname.trim(), sex: Number(form.sex) };
}

export function applyProfileUpdate(user, payload) {
  return { ...user, ...payload };
}

export function getUserDisplayName(user) {
  return user.nickname || user.email || '普通用户';
}

export const passwordFields = [
  { key: 'currentPassword', label: '当前密码', placeholder: '请输入当前密码' },
  { key: 'newPassword', label: '新密码', placeholder: '请输入至少 8 位新密码' },
  { key: 'confirmPassword', label: '确认新密码', placeholder: '请再次输入新密码' },
];
export function createPasswordForm() {
  return { currentPassword: '', newPassword: '', confirmPassword: '' };
}
export function validatePasswordChange(form) {
  const errors = {};
  if (!form.currentPassword) errors.currentPassword = '请输入当前密码';
  if (form.newPassword.length < 8) errors.newPassword = '新密码长度不能少于 8 位';
  if (form.newPassword !== form.confirmPassword) errors.confirmPassword = '两次输入的新密码不一致';
  return errors;
}
export function handlePasswordChange(form) {
  return { ok: Object.keys(validatePasswordChange(form)).length === 0 };
}
