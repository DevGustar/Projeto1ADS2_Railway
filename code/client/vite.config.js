const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "./",
  preview: {
    port: process.env.PORT || 8080,
    host: true,
    allowedHosts: ["institutocriativo.up.railway.app", "localhost", "127.0.0.1"]
  }
});
