// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Nutné pro WSL, Docker nebo síťové disky
      interval: 100, // Zajišťuje časté sledování změn
    },
    hmr: true, // Povolit Hot Module Replacement
  },
});
