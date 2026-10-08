// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// 5 Star Limousine Service — static Astro rebuild.
// Every asset (images, fonts, styles) is served from this repo;
// the only outbound requests are the analytics/review tracking scripts.
export default defineConfig({
  site: 'https://5starlimooc.com',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Preview host headers — vite 403s these otherwise.
      allowedHosts: ['.trycloudflare.com', 'web.clickboostmedia.com', '.clickboostmedia.com'],
      host: true,
    },
  },
});
