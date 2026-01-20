import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mikare.health',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
