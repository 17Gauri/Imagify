import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Make sure the output folder is set (default is 'dist')
  },
  server: {
    port: 5173,     // Local dev port
    host: true,     // Allow access on local network (needed on Render sometimes)
  },
})
