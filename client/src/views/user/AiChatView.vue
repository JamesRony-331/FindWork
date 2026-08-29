<script setup>
import { nextTick, reactive, ref } from 'vue';
import UserLayout from '../../layouts/UserLayout.vue';
import AppIcon from '../../components/common/AppIcon.vue';
import { createChatState, suggestions } from '../../data/user/aiChat';
const state = reactive(createChatState());
const messageList = ref(null);
async function send() {
  if (state.sendMessage()) {
    await nextTick();
    messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' });
  }
}
function keydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
}
</script>
<template>
  <UserLayout>
    <div class="chat-page">
      <aside class="conversation-panel">
        <button
          class="button button-primary new-chat"
          type="button"
          @click="state.createConversation"
        >
          ＋ 新建对话
        </button>
        <span class="conversation-label">最近对话</span>
        <button
          v-for="item in state.conversations"
          :key="item.id"
          class="conversation-item"
          :class="{ active: item.id === state.activeConversationId }"
          @click="state.selectConversation(item.id)"
        >
          <span>{{ item.title }}</span>
          <small>{{ item.time }}</small>
        </button>
      </aside>
      <main class="chat-workspace">
        <header>
          <h1>AI 就业助手</h1>
          <span>本地演示模式</span>
        </header>
        <div ref="messageList" class="message-list">
          <section class="suggestion-box">
            <strong>可以询问岗位趋势、薪资水平和城市就业机会</strong>
            <button
              v-for="item in suggestions"
              :key="item"
              type="button"
              @click="state.selectSuggestion(item)"
            >
              <AppIcon name="search" :size="16" />
              {{ item }}
            </button>
          </section>
          <article
            v-for="message in state.messages"
            :key="message.id"
            class="message"
            :class="message.role"
          >
            <div class="avatar">{{ message.role === 'assistant' ? 'AI' : '我' }}</div>
            <div>
              <time>{{ message.time }}</time>
              <p>{{ message.content }}</p>
            </div>
          </article>
        </div>
        <form class="composer" @submit.prevent="send">
          <textarea
            v-model="state.draft"
            class="textarea"
            placeholder="请输入问题，Enter 发送，Shift + Enter 换行"
            @keydown="keydown"
          />
          <div>
            <span>回复内容为静态演示数据</span>
            <button class="button button-primary" type="submit" :disabled="!state.draft.trim()">
              发送
            </button>
          </div>
        </form>
      </main>
    </div>
  </UserLayout>
</template>
<style scoped>
.chat-page {
  display: grid;
  grid-template-columns: 250px 1fr;
  height: calc(100vh - var(--topbar-height));
  padding: 18px 22px 22px;
  gap: 1px;
}
.conversation-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px 0 0 8px;
}
.new-chat {
  margin-bottom: 10px;
}
.conversation-label {
  padding: 4px 8px;
  color: var(--color-text-muted);
  font-size: 12px;
}
.conversation-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 9px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  background: transparent;
  text-align: left;
}
.conversation-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conversation-item small {
  flex: 0 0 auto;
  color: var(--color-text-muted);
}
.conversation-item.active {
  color: var(--color-primary-800);
  background: var(--color-accent-soft);
}
.chat-workspace {
  display: grid;
  grid-template-rows: 58px 1fr auto;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-left: 0;
  border-radius: 0 8px 8px 0;
  background: #fff;
}
.chat-workspace > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  border-bottom: 1px solid var(--color-border);
}
.chat-workspace h1 {
  font-size: 21px;
  color: var(--color-primary-900);
}
.chat-workspace header span {
  color: var(--color-text-muted);
  font-size: 12px;
}
.message-list {
  overflow-y: auto;
  padding: 22px;
}
.suggestion-box {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface-muted);
}
.suggestion-box button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-primary-700);
  background: #fff;
  text-align: left;
}
.message {
  display: flex;
  gap: 10px;
  max-width: 78%;
  margin-top: 18px;
}
.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}
.avatar {
  display: grid;
  place-items: center;
  flex: 0 0 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  background: var(--color-primary-700);
  font-size: 11px;
}
.message time {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text-muted);
  font-size: 11px;
}
.message.user time {
  text-align: right;
}
.message p {
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  white-space: pre-wrap;
}
.message.user p {
  border-color: #d7e7f3;
  background: #edf6fb;
}
.composer {
  margin: 0 20px 18px;
  padding: 10px;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
}
.composer textarea {
  min-height: 72px;
  padding: 4px;
  border: 0;
  box-shadow: none;
}
.composer > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: 12px;
}
@media (max-width: 760px) {
  .chat-page {
    grid-template-columns: 1fr;
    height: auto;
    padding: 12px;
  }
  .conversation-panel {
    display: none;
  }
  .chat-workspace {
    min-height: calc(100vh - 88px);
    border-left: 1px solid var(--color-border);
    border-radius: 8px;
  }
  .message {
    max-width: 92%;
  }
  .message-list {
    padding: 14px;
  }
  .composer {
    margin: 0 12px 12px;
  }
}
</style>
