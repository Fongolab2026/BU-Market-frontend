import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { landingQrPlugin } from './qr-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Port du backend Django. Configurable via .env pour éviter les collisions
  // de ports avec d'autres projets tournant sur la même machine.
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

  const proxy = {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      secure: false,
    },
    '/media': {
      target: apiTarget,
      changeOrigin: true,
      secure: false,
    },
  }

  return {
    plugins: [react(), tailwindcss(), landingQrPlugin()],
    server: {
      host: true,
      proxy,
    },
    // `vite preview` n'hérite pas de `server.proxy` : sans ceci, un build
    // servi par `npm run preview` n'a plus d'API.
    preview: {
      proxy,
    },
  }
})
