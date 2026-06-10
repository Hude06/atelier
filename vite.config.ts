import { defineConfig } from "vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/client": "preact/compat",
    },
  },

  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },

  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: { passes: 2, drop_console: true },
      format: { comments: false },
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
