// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true,
    }),
    tailwindcss(),
  ],
  server: {
    host: true,       // allows access from 0.0.0.0 inside Docker
    port: 5173,       // fixed port for frontend dev server
    strictPort: true, // fail if 5173 is already in use
  },
});
