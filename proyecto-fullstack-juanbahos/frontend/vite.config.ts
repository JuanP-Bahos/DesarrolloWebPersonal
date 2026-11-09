import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Si el puerto 5173 está ocupado, Vite muestra un error en lugar de usar otro puerto.
    // Así evitamos errores de CORS (el backend solo acepta http://localhost:5173).
    strictPort: true,
  },
})
