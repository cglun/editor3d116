import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./EditorIndex": "./src/component/editor/EditorIndex.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
});
