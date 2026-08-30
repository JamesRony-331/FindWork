<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createDemoSession } from '../utils/demoSession.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const remember = ref(true)
const isPasswordVisible = ref(false)
const errors = reactive({ username: '', password: '' })

function submitLogin() {
  errors.username = username.value.trim() ? '' : '请输入管理员账号'
  errors.password = password.value ? '' : '请输入密码'

  if (errors.username || errors.password) {
    return
  }

  createDemoSession(username.value.trim(), remember.value)
  router.replace('/dashboard')
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

          <button class="button login-form__submit" type="submit">登录管理端</button>
          <p class="login-form__hint">演示环境：任意非空账号和密码均可登录</p>
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
  padding: clamp(72px, 18vh, 160px) clamp(48px, 9vw, 128px) 0;
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
  right: clamp(32px, 8vw, 128px);
  bottom: clamp(44px, 9vh, 108px);
  left: clamp(32px, 7vw, 112px);
  min-height: 400px;
}

.login-visual__donut {
  position: absolute;
  top: 8px;
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
  top: 30px;
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
  bottom: 80px;
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
  bottom: 82px;
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
  gap: var(--space-5);
  margin-top: 36px;
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
