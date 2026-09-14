// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server', // <-- ESTO ES CLAVE PARA QUE FUNCIONEN LAS APIS
  adapter: vercel(), // <-- ESTO CONECTA CON VERCEL
  base: '/',
  vite: {
    server: {
      allowedHosts: true,  // permite cualquier host
      watch: {
        // Polling necesario en WSL2 + Docker — inotify no propaga cambios del host al contenedor
        usePolling: true,
        interval: 300,
      },
    },
  },
});
