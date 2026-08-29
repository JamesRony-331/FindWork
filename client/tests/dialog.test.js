import test from 'node:test';
import assert from 'node:assert/strict';
import { closeDialog, confirmDialog, dialogState, showMessage } from '../src/utils/dialog.js';

test('信息弹窗关闭后完成 Promise', async () => {
  const result = showMessage({ title: '注册成功', message: '请使用新账号登录' });
  assert.equal(dialogState.open, true);
  assert.equal(dialogState.mode, 'message');
  closeDialog(true);
  assert.equal(await result, true);
  assert.equal(dialogState.open, false);
});

test('确认弹窗取消时返回 false', async () => {
  const result = confirmDialog({ title: '确认操作', message: '是否继续？' });
  assert.equal(dialogState.mode, 'confirm');
  closeDialog(false);
  assert.equal(await result, false);
});
