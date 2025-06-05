import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // MathLive assets
      "/fonts": path.resolve(__dirname, "node_modules/mathlive/fonts"),
      "/sounds": path.resolve(__dirname, "node_modules/mathlive/sounds"),
    },
  },
  optimizeDeps: {
    include: ['mathlive']
  }
}));