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
        "./EditorIndex": "./src/viewer/Viewer.tsx",
        //  "./EditorIndex": "./src/Hook.tsx",
      },
      shared: [
        "react",
        "react-dom",
        // "@tanstack/react-router",
        // "bootstrap",
        // "@originjs/vite-plugin-federation",
        //"bootstrap-icons",
        // "react-bootstrap",
        // "three",
      ],
      // import "bootstrap/dist/css/bootstrap.css";
      // import "bootstrap-icons/font/bootstrap-icons.css";
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    conditions: ["browser", "import"],
  },
});
