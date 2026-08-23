import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET ||
    env.VITE_API_BASE_URL ||
    'https://playbit-ih.duckdns.org'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookie = proxyRes.headers['set-cookie']

              if (setCookie) {
                proxyRes.headers['set-cookie'] = setCookie.map(
                  (cookie) =>
                    cookie
                      .replace(/;\s*Secure/gi, '')
                      .replace(/;\s*SameSite=None/gi, ''),
                )
              }
            })
          },
        },
      },
    },
  }
})

