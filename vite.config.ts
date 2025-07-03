import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dotenv from "dotenv";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    server: {
      host: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    base: "/", /* estaba asi " "  pero se dejo "/" por falla del servidor  */
    build: {
      outDir: isProduction ? 'dist/prod' : 'dist/dev',
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
    define: {
      "process.env": JSON.stringify(dotenv.config().parsed),
    },
  };
});
