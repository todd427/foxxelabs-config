import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Single self-contained index.html — drop it on any static host.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: "es2018", cssCodeSplit: false, assetsInlineLimit: 100000000 },
});
