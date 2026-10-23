import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 시크릿이 같이 있는 .env의 GOOGLE_WEB_CLIENT_ID만 브라우저에 노출한다.
  envPrefix: ['VITE_', 'GOOGLE_WEB_CLIENT_ID'],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
