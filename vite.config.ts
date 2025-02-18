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
        "./Viewer3d": "./src/Viewer3d/Viewer3d.tsx",
        "./init3dViewer": "./src/three/init3dViewer.ts",
        //  "./Index": "./src/Hook.tsx",
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
  base: "/editor3d/",
  build: {
    modulePreload: false,
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
    outDir: "../datav_vr_2d/editor3d",
    // outDir: "editor3d",
    assetsDir: "assets",
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1600,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // manualChunks: (id) => {
        //   if (id.includes("node_modules")) {
        //     return "xx";
        //   }
        // },
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: (parameter) => {
          if (parameter.name.includes("xx")) {
            return "assets/[name].js";
          } else {
            return "assets/[name]-[hash].js";
          }
        },
        entryFileNames: "assets/[name].js",
        // entryFileNames: "assets/[name]-[hash].[js]",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8042",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
      "/file": {
        target: "http://localhost:8042",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    conditions: ["browser", "import"],
  },
});
