// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "./index.html"),
        cards: resolve(__dirname, "./pages/cards.html"),
      },
    },
  },
});
