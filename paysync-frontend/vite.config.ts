import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      // Forward any requests to these paths to your API Gateway
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/wallet': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/transactions': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}));
