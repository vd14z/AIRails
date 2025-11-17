import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mapea "@" a la ruta absoluta de la carpeta "src"
      '@': resolve(__dirname, './src'),
    },
  },
})
