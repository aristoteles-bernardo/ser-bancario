import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactComponentTagger } from 'react-component-tagger';

export default defineConfig({
  base: '/', // '/' para raiz. Use './' se for servir em subpasta/hosts temporários.
  plugins: [
    react(),
    reactComponentTagger() as PluginOption,
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        // remove the /api prefix if backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 10240,
  },
});