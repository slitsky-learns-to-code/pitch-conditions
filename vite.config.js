import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config: enables React (JSX + Fast Refresh).
// We honor a PORT env var if one is set (some tooling assigns the port that
// way); otherwise Vite uses its default 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
