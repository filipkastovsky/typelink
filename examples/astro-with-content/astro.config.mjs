import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import typelink from '@typelink/adapter-astro';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), typelink.astro()],
});
