<script setup>
defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
});
defineEmits(['action']);
</script>
<template>
  <div class="data-table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="row[rowKey] ?? index">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              <button
                v-if="column.action"
                class="text-link"
                type="button"
                @click="$emit('action', row, column)"
              >
                {{ column.action }}
              </button>
              <span v-else>{{ row[column.key] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <slot v-if="!rows.length" name="empty" />
  </div>
</template>
