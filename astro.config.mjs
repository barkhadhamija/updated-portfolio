import { defineConfig } from 'astro/config';

export default defineConfig({
  // Your live address. Link previews (LinkedIn, WhatsApp, X) need it to find the preview image.
  site: 'https://your-domain.com',
  prefetch: true,
});
