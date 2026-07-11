import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages compatible: relative paths in build output
// Set VITE_BASE=/your-repo-name/ via env var for non-root pages
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Stable filenames for better CDN caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})