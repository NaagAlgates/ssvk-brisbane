import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ssvk.naaglabs.workers.dev', // update to custom domain when ready
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: false },
    imageService: 'compile',
  }),
  integrations: [react(), keystatic(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:async_hooks', 'node:crypto', 'node:fs', 'node:path', 'node:fs/promises'],
    },
  },
});
