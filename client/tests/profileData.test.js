import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyProfileUpdate,
  createProfileFields,
  createProfileForm,
  createProfilePayload,
  getUserDisplayName,
  readStoredUser,
  validateProfile,
} from '../src/data/common/profile.js';

test('个人信息将 UserLoginVO 转换为展示字段', () => {
  assert.deepEqual(createProfileFields({ nickname: '小林', email: 'lin@example.com', sex: 1 }), [
    { label: '昵称', value: '小林' },
    { label: '邮箱', value: 'lin@example.com' },
    { label: '性别', value: '男' },
  ]);
});

test('个人信息对缺失字段显示未设置', () => {
  assert.deepEqual(createProfileFields({ sex: 0 }), [
    { label: '昵称', value: '未设置' },
    { label: '邮箱', value: '未设置' },
    { label: '性别', value: '未设置' },
  ]);
});

test('损坏的用户缓存返回空对象', () => {
  const storage = { getItem: () => '{bad json' };
  assert.deepEqual(readStoredUser(storage), {});
});

test('修改资料表单从登录用户初始化', () => {
  assert.deepEqual(createProfileForm({ nickname: '小林', sex: 2, email: 'lin@example.com' }), {
    nickname: '小林',
    sex: 2,
  });
});

test('修改资料校验拒绝空昵称', () => {
  assert.equal(validateProfile({ nickname: ' ', sex: 1 }).nickname, '请输入昵称');
});

test('修改资料请求只提交昵称和性别', () => {
  assert.deepEqual(createProfilePayload({ nickname: ' 新昵称 ', sex: '1' }), {
    nickname: '新昵称',
    sex: 1,
  });
});

test('更新成功后合并用户缓存并保留 token', () => {
  assert.deepEqual(
    applyProfileUpdate(
      { nickname: '旧昵称', email: 'lin@example.com', token: 'token-value' },
      { nickname: '新昵称', sex: 1 },
    ),
    { nickname: '新昵称', email: 'lin@example.com', sex: 1, token: 'token-value' },
  );
});

test('顶部栏优先显示用户昵称', () => {
  assert.equal(getUserDisplayName({ nickname: '小林', email: 'lin@example.com' }), '小林');
  assert.equal(getUserDisplayName({ email: 'lin@example.com' }), 'lin@example.com');
  assert.equal(getUserDisplayName({}), '普通用户');
});
