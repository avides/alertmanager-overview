import { createApp } from 'vue';
import App from './App.vue';
import { loadConfig } from './config';
import './style.css';

loadConfig()
  .then(config => createApp(App, { ...config }).mount('#app'))
  .catch((error: unknown) => {
    console.error(error);
    document.getElementById('app')!.textContent = String(error);
  });
