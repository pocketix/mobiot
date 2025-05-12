// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

const fullReloadAlways = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
};

export default defineConfig({
  server: {
    port:3200,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: true,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Mobiot',
      fileName: 'mobiot',
    },
    rollupOptions: {
      output: {
        globals: {
          lit: 'Lit'
        },
      },
    },
  },
  plugins: [dts()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@condition': path.resolve(__dirname, './src/condition'),
      '@convert': path.resolve(__dirname, './src/convert'),
      '@editor': path.resolve(__dirname, './src/editor'),
      '@general': path.resolve(__dirname, './src/general'),
      '@icons': path.resolve(__dirname, './src/icons'),
      '@variable': path.resolve(__dirname, './src/variable'),
    },
  },
})
