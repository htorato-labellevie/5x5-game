// vite.config.ts

import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
	//allowedHosts: ['c884-126-15-23-48.ngrok-free.app']
    allowedHosts: [],
  },
});
