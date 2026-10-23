import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, cpSync } from "node:fs";
import { resolve } from "node:path";
const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory()
      ? htmlFiles(resolve(dir, f.name))
      : f.name.endsWith(".html")
        ? [resolve(dir, f.name)]
        : [],
  );
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "existing-static-assets",
      closeBundle() {
        for (const name of ["images", "robots.txt", "sitemap.xml"])
          cpSync(name, `dist/${name}`, { recursive: true });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: [resolve("index.html"), ...htmlFiles(resolve("blog"))],
    },
  },
});
