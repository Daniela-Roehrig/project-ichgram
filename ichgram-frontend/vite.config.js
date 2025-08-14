import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // für React Router
    proxy: {
      '/api': 'http://localhost:3000' // leitet API-Requests an dein Backend
    }
  }
})
