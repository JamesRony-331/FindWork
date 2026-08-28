<script setup>
import { publicNavItems } from '../data/navigation'
</script>
<template>
  <div class="public-layout">
    <header class="public-header">
      <router-link class="brand" to="/"><span class="brand-mark">毕</span><span>高校毕业生招聘信息采集分析系统</span></router-link>
      <nav class="public-nav" aria-label="公共导航">
        <router-link v-for="item in publicNavItems" :key="item.path" :to="item.path">{{ item.label }}</router-link>
      </nav>
      <router-link class="button public-login" to="/login">登录</router-link>
    </header>
    <main><slot /></main>
  </div>
</template>

<style scoped>
.public-layout{min-height:100vh;background:var(--color-bg)}.public-header{height:68px;padding:0 max(24px,calc((100vw - 1320px)/2));display:flex;align-items:center;gap:34px;color:#fff;background:var(--color-primary-900)}.brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:700;margin-right:auto}.brand-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:6px;background:var(--color-accent)}.public-nav{display:flex;align-items:center;gap:30px;height:100%}.public-nav a{display:flex;align-items:center;height:100%;border-bottom:2px solid transparent;color:#dbe8ed}.public-nav a.router-link-active{color:#fff;border-bottom-color:#42d2c7}.public-login{color:#fff;border-color:#6f94a5;background:transparent}@media(max-width:760px){.public-header{height:auto;min-height:64px;padding:12px 14px;flex-wrap:wrap;gap:12px}.brand{font-size:14px}.public-nav{order:3;width:100%;justify-content:space-between;gap:10px;height:36px}.public-login{padding:0 12px}}
</style>
