<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <template v-if="name === 'dashboard'">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c.8-3.4 3.2-5.2 7.5-5.2s6.7 1.8 7.5 5.2" />
    </template>
    <template v-else-if="name === 'briefcase'">
      <rect x="3.5" y="7.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 7.5V5.8c0-.7.6-1.3 1.3-1.3h4.4c.7 0 1.3.6 1.3 1.3v1.7M3.5 12h17M10 12v2h4v-2" />
    </template>
    <template v-else-if="name === 'collection'">
      <path d="M5 4.5h10.5l3.5 3.5v11.5H5z" />
      <path d="M15.5 4.5V8H19M8.5 12h7M8.5 15.5h7" />
    </template>
    <template v-else-if="name === 'clean'">
      <path d="m5 17 8.8-8.8 4 4L9 21H5z" />
      <path d="m12.3 6.5 1.5-1.5 4 4-1.5 1.5M4 21h16" />
    </template>
    <template v-else-if="name === 'dictionary'">
      <path d="M4.5 4.5h6.8c1.3 0 2.2.8 2.2 2v12c0-1.2-.9-2-2.2-2H4.5z" />
      <path d="M19.5 4.5h-6.8c-1.3 0-2.2.8-2.2 2v12c0-1.2.9-2 2.2-2h6.8z" />
    </template>
    <template v-else-if="name === 'log'">
      <path d="M5 3.5h11l3 3v14H5z" />
      <path d="M16 3.5v4h3M8 11h8M8 14.5h8M8 18h5" />
    </template>
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </template>
    <template v-else-if="name === 'menu-tree'">
      <path d="M5 4v16M5 8h5M5 16h5" />
      <rect x="10" y="5.5" width="9" height="5" rx="1" />
      <rect x="10" y="13.5" width="9" height="5" rx="1" />
    </template>
    <template v-else-if="name === 'roles'">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3 2.4-4.5 5.5-4.5s4.9 1.5 5.5 4.5M15 5.5a3 3 0 0 1 0 5.5M16 14.5c2.6.2 4 1.7 4.5 4.5" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3.5 19 6v5.5c0 4.2-2.4 7.2-7 9-4.6-1.8-7-4.8-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </template>
    <template v-else-if="name === 'chevron'">
      <path d="m8 10 4 4 4-4" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </template>
    <template v-else-if="name === 'logout'">
      <path d="M10 4.5H5.5v15H10M14 8l4 4-4 4M8.5 12H18" />
    </template>
  </svg>
</template>

<style scoped>
.app-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
</style>
