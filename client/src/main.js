import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/responsive.css';
import App from './App.vue';
import routes from './router/router';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
