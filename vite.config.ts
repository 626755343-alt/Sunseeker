import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project sites live under /<repository>/.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
