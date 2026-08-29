<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { closeDialog, dialogState } from '../../utils/dialog.js';

function handleKeydown(event) {
  if (dialogState.open && event.key === 'Escape') closeDialog(false);
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="dialogState.open" class="dialog-backdrop" @click.self="closeDialog(false)">
        <section
          class="dialog-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'app-dialog-title'"
        >
          <div class="dialog-icon" :class="{ confirm: dialogState.mode === 'confirm' }">
            {{ dialogState.mode === 'confirm' ? '?' : '✓' }}
          </div>
          <h2 id="app-dialog-title">{{ dialogState.title }}</h2>
          <p>{{ dialogState.message }}</p>
          <div class="dialog-actions">
            <button
              v-if="dialogState.mode === 'confirm'"
              class="button dialog-cancel"
              type="button"
              @click="closeDialog(false)"
            >
              {{ dialogState.cancelText }}
            </button>
            <button
              class="button button-primary"
              type="button"
              autofocus
              @click="closeDialog(true)"
            >
              {{ dialogState.confirmText }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(7, 35, 49, 0.48);
  backdrop-filter: blur(3px);
}
.dialog-panel {
  width: min(100%, 420px);
  padding: 30px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 24px 64px rgba(7, 51, 74, 0.2);
  text-align: center;
}
.dialog-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-success);
  font-size: 24px;
  font-weight: 700;
}
.dialog-icon.confirm {
  background: #fff3df;
  color: var(--color-warning);
}
h2 {
  color: var(--color-primary-900);
  font-size: 21px;
}
p {
  margin-top: 10px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
}
.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}
.dialog-actions .button {
  min-width: 104px;
}
.dialog-cancel {
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text-secondary);
}
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.18s ease;
}
.dialog-fade-enter-active .dialog-panel,
.dialog-fade-leave-active .dialog-panel {
  transition: transform 0.18s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
.dialog-fade-enter-from .dialog-panel,
.dialog-fade-leave-to .dialog-panel {
  transform: translateY(8px) scale(0.98);
}
</style>
