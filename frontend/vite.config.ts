import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,      // Optional: set specific port
    strictPort: true // Optional: fail if port is occupied
  },
})
