import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CROPEX_TARGET = "https://HFEIamala-production.up.railway.app";

const apiProxy = {
  "/api": {
    target: CROPEX_TARGET,
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
});
