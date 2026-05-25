import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const environment = loadEnv(mode, process.cwd(), '');
    const port = Number(environment.VITE_PORT ?? 3001);

    const target = environment.API_TARGET_URL;
    if (!target) {
        throw new Error('[vite] API_TARGET_URL is not set in .env — add it to configure the proxy target.');
    }

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port,
            strictPort: true,
            host: true,
            allowedHosts: [environment.VITE_ALLOWED_HOST],
            proxy: {
                '/api': {
                    target,
                    changeOrigin: true,
                    secure: true,
                },
                '/socket.io': {
                    target,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
        preview: {
            port,
            strictPort: true,
            host: true,
            allowedHosts: [environment.VITE_ALLOWED_HOST],
        },
    };
});
