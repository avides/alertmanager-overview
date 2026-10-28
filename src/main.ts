import { createApp } from 'vue';
import App from './App.vue';
import { loadConfig } from './config';
import './style.css';

try {
  const config = await loadConfig();
  createApp(App, { ...config }).mount('#app');
} catch (error) {
  console.error(error);
  const app = document.getElementById('app')!;
  app.className = 'dark-theme-title';
  app.textContent = String(error);
}
