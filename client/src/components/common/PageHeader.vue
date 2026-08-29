<script setup>
defineProps({ title: String, description: String, meta: String });
</script>
<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="description" class="page-description">{{ description }}</p>
    </div>
    <span v-if="meta" class="page-meta">{{ meta }}</span>
  </header>
</template>
