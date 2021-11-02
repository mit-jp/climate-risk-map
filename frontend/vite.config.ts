import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [react(), svelte()],
    build: { outDir: "./build" },
    server: {
        proxy: {
            "/api": {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, "")
            }
        }
    }
});