import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ssvk-brisbane.pages.dev',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:async_hooks', 'node:crypto', 'node:fs', 'node:path'],
    },
  },
});
