import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for the Smart Procurement Platform frontend (SIH26032)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
