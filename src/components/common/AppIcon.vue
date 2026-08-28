<script setup>
defineProps({ name: { type: String, default: 'dashboard' }, size: { type: Number, default: 19 } })
</script>

<template>
  <svg class="app-icon" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'dashboard'"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></template>
    <template v-else-if="name === 'chart'"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></template>
    <template v-else-if="name === 'search'"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></template>
    <template v-else-if="name === 'briefcase'"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></template>
    <template v-else-if="name === 'salary'"><circle cx="12" cy="12" r="9"/><path d="m8 7 4 5 4-5M8 13h8M12 12v6"/></template>
    <template v-else-if="name === 'location'"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></template>
    <template v-else-if="name === 'education'"><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5M21 9v6"/></template>
    <template v-else-if="name === 'layers'"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></template>
    <template v-else-if="name === 'filter'"><path d="M4 5h16M7 12h10M10 19h4"/></template>
    <template v-else-if="name === 'chat'"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></template>
    <template v-else-if="name === 'user'"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></template>
    <template v-else-if="name === 'menu'"><path d="M4 6h16M4 12h16M4 18h16"/></template>
    <template v-else-if="name === 'arrow-right'"><path d="M5 12h14M14 7l5 5-5 5"/></template>
    <template v-else><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></template>
  </svg>
</template>
