import { createApp } from 'vue';
import App from './App.vue';
import { loadConfig } from './config';
import './style.css';

try {
  const config = await loadConfig();
  createApp(App, { ...config }).mount('#app');
} catch (error) {
  console.error(error);
  document.getElementById('app')!.textContent = String(error);
}
