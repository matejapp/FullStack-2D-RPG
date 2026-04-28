import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the Express server during dev,
      // so the client can just call /api/... with no CORS pain.
      "/api": "http://localhost:3001",
    },
  },
});
