import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Blocks non-same-origin script execution, which is what would let an
// attacker who finds an XSS hole actually exfiltrate the admin JWT out of
// localStorage. 'unsafe-eval' is only added in dev because Vite's dependency
// pre-bundler (esbuild, .vite/deps/*) relies on eval() for some deps at dev
// time - that code path doesn't exist in a production `vite build` output,
// so the shipped app gets the strict policy.
// style-src needs 'unsafe-inline' because Radix UI sets inline `style`
// attributes for positioning popovers/selects - a much lower-severity gap
// than allowing arbitrary inline/eval'd scripts.
// connect-src includes VITE_API_URL's origin (if set) so the CSP doesn't
// silently block api.ts's fetch calls when frontend/backend are deployed to
// different origins (e.g. Vercel + Railway/Render) - see src/lib/api.ts.
// Note: frame-ancestors/report-uri can't be set via <meta> (the spec requires
// an HTTP response header for those) - add them at the reverse proxy/host if
// this is ever deployed behind one.
function cspPlugin(isDev: boolean, apiUrl: string): Plugin {
  const connectSrc = ["'self'", ...(apiUrl ? [new URL(apiUrl).origin] : [])].join(' ')
  const csp = [
    "default-src 'self'",
    `script-src 'self'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ')

  return {
    name: 'inject-csp-meta',
    transformIndexHtml(html) {
      return html.replace(
        '<!-- CSP_PLACEHOLDER -->',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
      )
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      cspPlugin(command === 'serve', env.VITE_API_URL ?? ''),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5207",
          changeOrigin: true,
        },
      },
    },
  }
})