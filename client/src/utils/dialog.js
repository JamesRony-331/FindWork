import { reactive } from 'vue';

export const dialogState = reactive({
  open: false,
  mode: 'message',
  title: '',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
});

let resolveDialog = null;

function openDialog(options, mode) {
  if (resolveDialog) resolveDialog(false);
  Object.assign(dialogState, {
    open: true,
    mode,
    title: options.title || '提示',
    message: options.message || '',
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
  });
  return new Promise((resolve) => {
    resolveDialog = resolve;
  });
}

export function showMessage(options) {
  return openDialog(options, 'message');
}

export function confirmDialog(options) {
  return openDialog(options, 'confirm');
}

export function closeDialog(confirmed = false) {
  dialogState.open = false;
  const resolve = resolveDialog;
  resolveDialog = null;
  if (resolve) resolve(confirmed);
}
