import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    // Allow sandbox / tunnel preview hosts (Arena, ngrok, e2b) and LAN access
    allowedHosts: true,
    hmr: { overlay: true },
  },
  preview: {
    host: '0.0.0.0',
    port: 4000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
