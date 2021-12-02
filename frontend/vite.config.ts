import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: { outDir: "./build" },
    server: {
        proxy: {
            "/api/editor": {
                target: 'http://127.0.0.1:4040',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api\/editor/, "")
            },
            "/api": {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, "")
            },
        }
    }
});