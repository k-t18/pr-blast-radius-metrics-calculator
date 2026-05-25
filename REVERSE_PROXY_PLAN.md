# Reverse Proxy Plan: Hide Backend Base URL

## Problem

The frontend is a Vite + React SPA that calls the ERPNext/Frappe backend directly from the browser. This creates two layers of exposure:

1. **Network tab**: Every API request shows the full backend hostname (`dev-chances.8848digitalerp.com`) in the browser's DevTools.
2. **JS bundle**: `VITE_API_BASE_URL` is a `VITE_`-prefixed env var — Vite embeds it into the client bundle at build time, making it readable in the minified source even before any network request. The hardcoded fallback in `apiConstants.ts` has the same problem.

---

## Solution: Reverse Proxy Pattern

The frontend switches to **relative paths** (`/api/...`). A proxy layer silently forwards them to the real backend — the backend hostname never reaches the browser.

- **Dev**: Vite's built-in `server.proxy`
- **Prod**: Nginx `proxy_pass` block

---

## Files to Change

### 1. `src/constants/apiConstants.ts`

```ts
// Before
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev-chances.8848digitalerp.com';

// After
export const API_BASE_URL = ''; // proxy handles routing; backend URL stays server-side
```

### 2. `.env`

```env
# Remove VITE_API_BASE_URL (VITE_ prefix = baked into client bundle)
# Add non-prefixed var — server-side only, never sent to browser

API_TARGET_URL=https://dev-chances.8848digitalerp.com
VITE_PORT=3286
VITE_ALLOWED_HOST=dev-chances-frontend.8848digitalerp.com
```

### 3. `vite.config.ts`

Add a `server.proxy` block. Use `loadEnv` with `''` prefix to read `API_TARGET_URL` (non-`VITE_`-prefixed) in Node context:

```ts
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), ''); // '' loads ALL env vars
    const target = env.API_TARGET_URL || 'https://dev-chances.8848digitalerp.com';

    return {
        // ...existing config...
        server: {
            // ...existing server config...
            proxy: {
                '/api': {
                    target,
                    changeOrigin: true,
                    secure: true,
                },
                '/socket.io': {
                    // covers Socket.io connection too
                    target,
                    changeOrigin: true,
                    ws: true, // enable WebSocket proxying
                },
            },
        },
    };
});
```

### 4. `nginx.example.conf` (new file — for production deployment)

```nginx
server {
    listen 80;
    server_name dev-chances-frontend.8848digitalerp.com;
    root /var/www/chances-frontend/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls — backend URL stays on the server
    location /api/ {
        proxy_pass https://dev-chances.8848digitalerp.com;
        proxy_set_header Host dev-chances.8848digitalerp.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    # WebSocket proxy for Socket.io
    location /socket.io/ {
        proxy_pass https://dev-chances.8848digitalerp.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host dev-chances.8848digitalerp.com;
        proxy_ssl_server_name on;
    }
}
```

---

## What Does NOT Need to Change

- `src/services/api/apiClient.ts` — already prepends `API_BASE_URL`; setting it to `""` makes all paths relative automatically.
- All service files and hooks — untouched.
- Auth token handling — untouched.

---

## Verification Steps

1. **Dev environment**
    - Run `npm run dev` and open DevTools → Network tab.
    - Make any API call — request URL should be `localhost:3286/api/...` (not the backend domain).
    - Verify response is valid data (proxy forwarding works).

2. **Bundle check**
    - `npm run build` then search dist folder for the backend hostname — should return nothing.

3. **Socket.io**
    - Verify Socket.io connection uses the local origin, not the backend domain directly.
    - Check how `socket.io-client` is initialized — if it reads `API_BASE_URL`, it's covered. If it has a separate hardcoded URL, that needs an additional fix.

4. **Production**
    - Apply nginx config → verify API calls return expected data.
    - Confirm backend hostname is absent from the browser network tab.
