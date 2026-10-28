import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the page also works behind a path prefix
  base: './',
  plugins: [vue()]
});
