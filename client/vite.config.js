import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "./",
  server: {
    port: process.env.PORT || 5173,
    host: true,
  },
  preview: {
    port: process.env.PORT || 8080,
    host: true,
    allowedHosts: ['client-institutocriativo.up.railway.app'],
  },
});