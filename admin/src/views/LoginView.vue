<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin, getRequestErrorMessage } from '../api/admin.js'
import { createAuthSession } from '../utils/authSession.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const remember = ref(false)
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')
const errors = reactive({ username: '', password: '' })

async function submitLogin() {
  loginError.value = ''
  errors.username = username.value.trim() ? '' : '请输入管理员账号'
  errors.password = password.value ? '' : '请输入密码'

  if (errors.username || errors.password) {
    return
  }

  isSubmitting.value = true
  try {
    const response = await adminLogin({ email: username.value.trim(), password: password.value })
    if (response.code !== 200 || !response.data?.token) throw new Error(response.info || '登录失败')
    createAuthSession(response.data, remember.value)
    router.replace('/dashboard')
  } catch (error) {
    loginError.value = getRequestErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-visual" aria-labelledby="login-brand-title">
      <div class="login-visual__brand">
        <p id="login-brand-title" class="login-visual__title">GoWorking 管理端</p>
        <span class="login-visual__rule" aria-hidden="true"></span>
        <p class="login-visual__subtitle">招聘数据管理平台</p>
      </div>

      <div class="login-visual__dashboard" aria-hidden="true">
        <svg class="login-visual__donut" viewBox="0 0 120 120" role="presentation">
          <circle cx="60" cy="60" r="42" pathLength="100" class="login-visual__donut-segment login-visual__donut-segment--one" />
          <circle cx="60" cy="60" r="42" pathLength="100" class="login-visual__donut-segment login-visual__donut-segment--two" />
          <circle cx="60" cy="60" r="42" pathLength="100" class="login-visual__donut-segment login-visual__donut-segment--three" />
        </svg>
        <div class="login-visual__legend">
          <span></span><span></span><span></span>
        </div>
        <svg class="login-visual__line-chart" viewBox="0 0 420 180" role="presentation">
          <path d="M28 152H398M28 116H398M28 80H398M28 44H398" class="login-visual__grid" />
          <polyline points="34,136 104,100 160,126 244,64 314,104 396,26" class="login-visual__line" />
          <circle cx="34" cy="136" r="5" /><circle cx="104" cy="100" r="5" />
          <circle cx="160" cy="126" r="5" /><circle cx="244" cy="64" r="5" />
          <circle cx="314" cy="104" r="5" /><circle cx="396" cy="26" r="5" />
        </svg>
        <div class="login-visual__bars">
          <span style="--bar-height: 32%"></span><span style="--bar-height: 48%"></span>
          <span style="--bar-height: 41%"></span><span style="--bar-height: 72%"></span>
          <span style="--bar-height: 50%"></span><span style="--bar-height: 76%"></span>
          <span style="--bar-height: 60%"></span><span style="--bar-height: 87%"></span>
        </div>
        <div class="login-visual__records">
          <span></span><span></span><span></span><span></span>
        </div>
        <svg class="login-visual__lower-grid" viewBox="0 0 300 180" role="presentation">
          <path d="M0 24H300M0 68H300M0 112H300M0 156H300M42 0V180M96 0V180M150 0V180M204 0V180M258 0V180" />
        </svg>
        <svg class="login-visual__briefcase" viewBox="0 0 84 72" role="presentation">
          <rect x="8" y="24" width="68" height="40" rx="4" />
          <path d="M28 24v-8c0-4 3-7 7-7h14c4 0 7 3 7 7v8M8 40h68M36 37v7h12v-7" />
        </svg>
        <svg class="login-visual__resume" viewBox="0 0 104 128" role="presentation">
          <path d="M14 4h54l22 22v98H14zM68 4v22h22" />
          <circle cx="38" cy="49" r="10" />
          <path d="M24 72c3-9 8-13 14-13s11 4 14 13M24 88h56M24 104h46" />
        </svg>
      </div>
    </section>

    <section class="login-form-area" aria-labelledby="login-title">
      <div class="login-form-wrap">
        <p class="login-form-wrap__mobile-brand">GoWorking 管理端</p>
        <h1 id="login-title">登录管理端</h1>
        <p class="login-form-wrap__description">使用管理员账号进入招聘数据管理大屏</p>

        <form class="login-form" novalidate @submit.prevent="submitLogin">
          <div class="field">
            <label class="field__label" for="admin-username">管理员账号</label>
            <input
              id="admin-username"
              v-model="username"
              class="field__control"
              name="username"
              type="text"
              autocomplete="username"
              :aria-invalid="Boolean(errors.username)"
              :aria-describedby="errors.username ? 'username-error' : undefined"
            />
            <p v-if="errors.username" id="username-error" class="field__error" aria-live="polite">{{ errors.username }}</p>
          </div>

          <div class="field">
            <label class="field__label" for="admin-password">密码</label>
            <div class="login-password-control">
              <input
                id="admin-password"
                v-model="password"
                class="field__control"
                name="password"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                :aria-invalid="Boolean(errors.password)"
                :aria-describedby="errors.password ? 'password-error' : undefined"
              />
              <button
                class="login-password-control__toggle"
                type="button"
                :aria-label="isPasswordVisible ? '隐藏密码' : '显示密码'"
                :aria-pressed="isPasswordVisible"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
                  <circle cx="12" cy="12" r="2.75" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" id="password-error" class="field__error" aria-live="polite">{{ errors.password }}</p>
          </div>

          <label class="login-remember">
            <input v-model="remember" type="checkbox" />
            <span>记住登录状态</span>
          </label>

          <button class="button login-form__submit" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? '正在登录…' : '登录管理端' }}
          </button>
          <p v-if="loginError" class="field__error login-form__error" aria-live="polite">{{ loginError }}</p>
          <p class="login-form__hint">请使用已授权的管理员账号登录</p>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 58fr) minmax(430px, 42fr);
}

.login-visual {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  color: var(--color-surface);
  background: var(--color-nav);
}

.login-visual::before,
.login-visual::after {
  position: absolute;
  width: 288px;
  height: 288px;
  border-radius: 50%;
  content: '';
  background: var(--color-primary);
}

.login-visual::before {
  top: -144px;
  right: -92px;
}

.login-visual::after {
  right: 80px;
  bottom: -172px;
  width: 330px;
  height: 330px;
}

.login-visual__brand {
  position: relative;
  z-index: 1;
  padding: clamp(72px, 18vh, 160px) clamp(48px, 5.55vw, 80px) 0;
}

.login-visual__title {
  font-size: clamp(36px, 3.25vw, 56px);
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.16;
}

.login-visual__rule {
  display: block;
  width: 50px;
  height: 5px;
  margin: var(--space-5) 0 var(--space-4);
  background: var(--color-primary);
}

.login-visual__subtitle {
  font-size: clamp(18px, 1.7vw, 24px);
  font-weight: 600;
}

.login-visual__dashboard {
  position: absolute;
  right: clamp(40px, 6.25vw, 90px);
  bottom: 0;
  left: clamp(40px, 5.55vw, 80px);
  min-height: 540px;
}

.login-visual__donut {
  position: absolute;
  top: 34px;
  left: 0;
  width: 110px;
  aspect-ratio: 1;
}

.login-visual__donut-segment {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 20;
  transform: rotate(-90deg);
  transform-origin: center;
}

.login-visual__donut-segment--one {
  stroke-dasharray: 35 65;
}

.login-visual__donut-segment--two {
  stroke-dasharray: 29 71;
  stroke-dashoffset: -42;
}

.login-visual__donut-segment--three {
  stroke-dasharray: 20 80;
  stroke-dashoffset: -78;
}

.login-visual__legend {
  position: absolute;
  top: 54px;
  left: 150px;
  display: grid;
  gap: 16px;
}

.login-visual__legend span {
  display: block;
  width: 80px;
  height: 2px;
  background: var(--color-primary);
}

.login-visual__legend span::before {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: -5px 14px 0 0;
  vertical-align: middle;
  content: '';
  background: var(--color-primary);
}

.login-visual__line-chart {
  position: absolute;
  top: 0;
  right: 0;
  width: min(55%, 420px);
  overflow: visible;
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2.5;
}

.login-visual__line-chart .login-visual__grid {
  stroke-dasharray: 5 5;
  stroke-width: 1;
  opacity: 0.55;
}

.login-visual__line-chart circle {
  fill: var(--color-primary);
  stroke: none;
}

.login-visual__bars {
  position: absolute;
  bottom: 210px;
  left: 0;
  display: flex;
  align-items: end;
  gap: 9px;
  width: 210px;
  height: 125px;
  padding: 0 12px;
  border-bottom: 1px solid var(--color-primary);
}

.login-visual__bars::before {
  position: absolute;
  top: 24px;
  right: 0;
  left: 0;
  height: 1px;
  content: '';
  background: var(--color-primary);
  box-shadow: 0 25px var(--color-primary), 0 50px var(--color-primary), 0 75px var(--color-primary);
  opacity: 0.45;
}

.login-visual__bars span {
  width: 15px;
  height: var(--bar-height);
  background: var(--color-primary);
}

.login-visual__records {
  position: absolute;
  right: 36px;
  bottom: 230px;
  display: grid;
  gap: 16px;
  width: min(48%, 280px);
}

.login-visual__records span {
  position: relative;
  display: block;
  height: 15px;
  margin-left: 36px;
  background: var(--color-primary);
}

.login-visual__records span::before {
  position: absolute;
  top: 0;
  right: calc(100% + 12px);
  width: 24px;
  height: 15px;
  content: '';
  background: var(--color-primary);
}

.login-visual__lower-grid,
.login-visual__briefcase,
.login-visual__resume {
  position: absolute;
  fill: none;
  stroke: var(--color-primary);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.login-visual__lower-grid {
  bottom: -8px;
  left: -80px;
  width: 300px;
  stroke-width: 1;
  opacity: 0.7;
}

.login-visual__briefcase {
  bottom: 96px;
  left: 34px;
  width: 70px;
  stroke-width: 2.5;
}

.login-visual__resume {
  bottom: 62px;
  left: min(43%, 286px);
  width: 86px;
  stroke-width: 2.5;
}

.login-form-area {
  display: grid;
  place-items: center;
  padding: var(--space-8);
  background: var(--color-surface);
}

.login-form-wrap {
  width: min(100%, 408px);
}

.login-form-wrap__mobile-brand {
  display: none;
}

.login-form-wrap h1 {
  color: var(--color-nav);
  font-size: var(--font-size-title);
  font-weight: 700;
  line-height: 1.25;
}

.login-form-wrap__description {
  margin-top: var(--space-2);
  color: var(--color-muted);
}

.login-form {
  display: grid;
  gap: 28px;
  margin-top: 36px;
}

.login-page .field__control {
  min-height: 52px;
}

.login-password-control {
  position: relative;
}

.login-password-control .field__control {
  padding-right: 48px;
}

.login-password-control__toggle {
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  display: grid;
  width: 44px;
  place-items: center;
  border-radius: var(--radius-control);
  color: var(--color-muted);
  background: transparent;
}

.login-password-control__toggle:hover {
  color: var(--color-primary);
}

.login-password-control__toggle svg {
  width: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.login-remember {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  color: var(--color-muted);
}

.login-remember input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.login-form__submit {
  width: 100%;
  min-height: 52px;
  font-size: var(--font-size-section);
}

.login-form__hint {
  margin-top: var(--space-1);
  color: var(--color-muted);
  font-size: var(--font-size-caption);
}

.login-form__error {
  text-align: left;
}

@media (max-width: 820px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-visual {
    display: none;
  }

  .login-form-area {
    align-items: start;
    padding-top: max(72px, 14vh);
  }

  .login-form-wrap__mobile-brand {
    display: block;
    margin-bottom: var(--space-8);
    color: var(--color-primary);
    font-size: var(--font-size-section);
    font-weight: 700;
  }
}

@media (max-width: 480px) {
  .login-form-area {
    padding: 48px var(--space-5);
  }

  .login-form {
    margin-top: var(--space-8);
  }
}
</style>
