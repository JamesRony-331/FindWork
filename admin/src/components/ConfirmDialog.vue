<script setup>
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
})

const emit = defineEmits(['confirm', 'cancel'])
const dialog = ref(null)
const titleId = useId()
const messageId = useId()
let opener = null

function focusableElements() {
  return dialog.value?.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? []
}

function focusFirst() {
  focusableElements()[0]?.focus()
}

function restoreFocus() {
  opener?.focus?.()
  opener = null
}

function cancel() {
  emit('cancel')
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
    return
  }

  if (event.key !== 'Tab') return

  const elements = [...focusableElements()]
  const first = elements[0]
  const last = elements.at(-1)
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    opener = typeof document === 'undefined' ? null : document.activeElement
    await nextTick()
    focusFirst()
  } else {
    restoreFocus()
  }
}, { immediate: true })

onBeforeUnmount(restoreFocus)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="confirm-dialog__backdrop" @click.self="cancel">
      <section
        ref="dialog"
        class="confirm-dialog panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="messageId"
        @keydown="onKeydown"
      >
        <h2 :id="titleId">{{ title }}</h2>
        <p :id="messageId">{{ message }}</p>
        <div class="confirm-dialog__actions">
          <button class="button button--secondary" type="button" @click="cancel">取消</button>
          <button class="button button--danger" type="button" @click="emit('confirm')">确认</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-dialog__backdrop {
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background: var(--color-nav);
}

.confirm-dialog {
  display: grid;
  width: min(100%, 420px);
  gap: var(--space-4);
  padding: var(--space-6);
}

.confirm-dialog h2 {
  font-size: var(--font-size-section);
}

.confirm-dialog p {
  color: var(--color-muted);
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

@media (prefers-reduced-motion: reduce) {
  .confirm-dialog,
  .confirm-dialog__backdrop {
    transition: none;
  }
}
</style>
