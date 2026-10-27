import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { outDir: 'docs', emptyOutDir: true, chunkSizeWarningLimit: 1500, target: 'es2020' },
  server: { host: '127.0.0.1', port: 5174 },
});
