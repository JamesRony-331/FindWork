<script setup>
defineProps({
  title: { type: String, default: '暂无数据' },
  description: { type: String, default: '当前条件下没有可展示的内容' },
});
</script>
<template>
  <div class="empty-state">
    <div>
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
      <slot />
    </div>
  </div>
</template>
