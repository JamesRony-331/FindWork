import test from 'node:test';
import assert from 'node:assert/strict';
import { reactive, watchEffect } from 'vue';
import { createChatState } from '../src/data/user/aiChat.js';

test('发送消息后追加用户消息和演示回复并清空输入', () => {
  const state = createChatState();
  const before = state.messages.length;
  state.draft = '杭州前端岗位趋势如何？';
  state.sendMessage();
  assert.equal(state.messages.length, before + 2);
  assert.equal(state.messages.at(-2).role, 'user');
  assert.equal(state.messages.at(-1).role, 'assistant');
  assert.equal(state.draft, '');
});

test('AI 状态经过 Vue reactive 包装后仍追加消息', () => {
  const state = reactive(createChatState());
  let renders = 0;
  const stop = watchEffect(
    () => {
      state.messages.length;
      renders += 1;
    },
    { flush: 'sync' },
  );
  state.draft = '杭州前端岗位趋势如何？';
  state.sendMessage();
  assert.equal(state.messages.length, 3);
  assert.equal(renders > 1, true);
  stop();
});
