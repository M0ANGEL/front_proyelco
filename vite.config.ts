import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 👈 Carga correctamente .env, .env.production, etc.

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: mode === 'production' ? 'dist/prod' : 'dist/dev',
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
    define: {
      'import.meta.env': JSON.stringify(env), // 👈 ESTO es lo que hace funcionar VITE_API_HOST
    },
  };
});
