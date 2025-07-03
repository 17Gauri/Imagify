import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  preview: {
    port: 10000,
    host: true,
    strictPort: true,
    allowedHosts: ['imagify-viso.onrender.com'], // ✅ Add your Render domain here
  },
})
