<script setup>
const props = defineProps({ fields: { type: Array, default: () => [] }, modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue', 'search', 'reset'])
function updateField(key, value) { emit('update:modelValue', { ...props.modelValue, [key]: value }) }
</script>
<template>
  <form class="filter-bar" @submit.prevent="$emit('search')">
    <label v-for="field in fields" :key="field.key">
      <span class="field-label">{{ field.label }}</span>
      <select v-if="field.type === 'select'" class="select" :value="modelValue[field.key]" @change="updateField(field.key, $event.target.value)"><option value="">{{ field.placeholder || '全部' }}</option><option v-for="option in field.options" :key="option.value ?? option" :value="option.value ?? option">{{ option.label ?? option }}</option></select>
      <input v-else class="input" :type="field.type || 'text'" :placeholder="field.placeholder" :value="modelValue[field.key]" @input="updateField(field.key, $event.target.value)">
    </label>
    <div class="filter-actions"><button class="button button-primary" type="submit">查询</button><button class="button" type="button" @click="$emit('reset')">重置</button></div>
  </form>
</template>
