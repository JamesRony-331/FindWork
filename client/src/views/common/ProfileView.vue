<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRequestErrorMessage } from '../../api/auth.js';
import { updateProfile } from '../../api/profile.js';
import UserLayout from '../../layouts/UserLayout.vue';
import PageHeader from '../../components/common/PageHeader.vue';
import {
  applyProfileUpdate,
  createProfileFields,
  createProfileForm,
  createProfilePayload,
  createPasswordForm,
  handlePasswordChange,
  passwordFields,
  readStoredUser,
  validateProfile,
  validatePasswordChange,
} from '../../data/common/profile';
import { confirmDialog, showMessage } from '../../utils/dialog.js';

const router = useRouter();
const user = reactive(readStoredUser(localStorage));
const profileFields = computed(() => createProfileFields(user));
const profileForm = reactive(createProfileForm(user));
const profileErrors = ref({});
const updating = ref(false);
const passwordForm = reactive(createPasswordForm());
const passwordErrors = ref({});
const message = ref('');

async function submitProfile() {
  profileErrors.value = validateProfile(profileForm);
  if (Object.keys(profileErrors.value).length > 0 || updating.value) return;

  updating.value = true;
  try {
    const payload = createProfilePayload(profileForm);
    const response = await updateProfile(payload);
    if (response.code !== 200) {
      await showMessage({ title: '保存失败', message: response.info || '请检查个人信息' });
      return;
    }

    const updatedUser = applyProfileUpdate(user, payload);
    Object.assign(user, updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('user-info-updated', { detail: updatedUser }));
    await showMessage({ title: '保存成功', message: '个人信息已更新。' });
  } catch (error) {
    await showMessage({ title: '无法保存', message: getRequestErrorMessage(error) });
  } finally {
    updating.value = false;
  }
}

function submitPassword() {
  passwordErrors.value = validatePasswordChange(passwordForm);
  if (handlePasswordChange(passwordForm).ok) {
    message.value = '密码修改演示已完成';
    Object.assign(passwordForm, createPasswordForm());
  }
}

async function logout() {
  const confirmed = await confirmDialog({
    title: '确认退出',
    message: '退出后需要重新登录才能访问用户功能，是否继续？',
    confirmText: '退出登录',
  });
  if (!confirmed) return;

  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  await router.push('/login');
}
</script>
<template>
  <UserLayout>
    <div class="page-content">
      <PageHeader title="个人信息" description="查看账号资料并管理登录密码" />
      <div class="profile-grid">
        <section class="panel">
          <div class="panel-heading"><h2 class="panel-title">基本资料</h2></div>
          <dl class="profile-list">
            <div v-for="item in profileFields" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
          <div class="profile-actions">
            <button class="button" type="button" @click="logout">退出登录</button>
          </div>
        </section>
        <form class="panel edit-panel" @submit.prevent="submitProfile">
          <div class="panel-heading">
            <div>
              <h2 class="panel-title">修改个人信息</h2>
              <p class="panel-description">更新后会同步到顶部导航栏</p>
            </div>
          </div>
          <div class="panel-body profile-form">
            <label>
              <span class="field-label">昵称</span>
              <input
                v-model="profileForm.nickname"
                class="input"
                type="text"
                maxlength="20"
                placeholder="请输入昵称"
              />
              <span class="field-error">{{ profileErrors.nickname }}</span>
            </label>
            <label>
              <span class="field-label">性别</span>
              <select v-model="profileForm.sex" class="select">
                <option :value="0">未设置</option>
                <option :value="1">男</option>
                <option :value="2">女</option>
              </select>
              <span class="field-error">{{ profileErrors.sex }}</span>
            </label>
            <button class="button button-primary save-profile" type="submit" :disabled="updating">
              {{ updating ? '保存中…' : '保存个人信息' }}
            </button>
          </div>
        </form>
        <form class="panel password-panel" @submit.prevent="submitPassword">
          <div class="panel-heading"><h2 class="panel-title">修改密码</h2></div>
          <div class="panel-body">
            <label v-for="field in passwordFields" :key="field.key">
              <span class="field-label">{{ field.label }}</span>
              <input
                v-model="passwordForm[field.key]"
                class="input"
                type="password"
                :placeholder="field.placeholder"
              />
              <span class="field-error">{{ passwordErrors[field.key] }}</span>
            </label>
            <p v-if="message" class="success-message">{{ message }}</p>
            <button class="button button-primary" type="submit">保存新密码</button>
          </div>
        </form>
      </div>
    </div>
  </UserLayout>
</template>
<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.profile-list {
  padding: 4px 18px;
}
.profile-list div {
  display: grid;
  grid-template-columns: 120px 1fr;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}
dt {
  color: var(--color-text-secondary);
}
dd {
  margin: 0;
  color: var(--color-primary-900);
}
.profile-actions {
  display: flex;
  justify-content: flex-end;
  padding: 18px;
}
.panel-description {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 12px;
}
.profile-form {
  display: grid;
  gap: 16px;
}
.save-profile {
  justify-self: start;
  min-width: 144px;
}
.password-panel {
  grid-column: 1 / -1;
}
.password-panel .panel-body {
  display: grid;
  gap: 16px;
}
.password-panel .button {
  justify-self: start;
}
.success-message {
  margin: 0 0 14px;
  color: var(--color-success);
}
@media (max-width: 820px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .profile-list div {
    grid-template-columns: 100px 1fr;
  }
}
</style>
