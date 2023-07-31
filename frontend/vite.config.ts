import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react(), eslintPlugin()],
    build: { outDir: './build' },
    server: {
        proxy: {
            '/api/editor': {
                target: 'http://127.0.0.1:4040',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/editor/, ''),
            },
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
})
