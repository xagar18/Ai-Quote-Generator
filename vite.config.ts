import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "localhost",
    port: 3000,
  },
  plugins: [
    react(),
    {
      name: "fix-mime-type",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? "/"; // Prevent undefined URL errors

          if (url.endsWith(".tsx") || url.endsWith(".ts")) {
            res.setHeader("Content-Type", "text/javascript");
          }

          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});