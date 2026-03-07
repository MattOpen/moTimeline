import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Dev server: serve from project root so /images/, /src/ etc. are all reachable
  root: '.',
  publicDir: false,
  server: {
    open: '/example/index.html',
    fs: { allow: ['.'] },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/moTimeline.js'),
      name: 'MoTimeline',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'moTimeline.js';
        if (format === 'cjs') return 'moTimeline.cjs';
        return 'moTimeline.umd.js';
      },
    },
    rollupOptions: {
      output: {
        exports: 'named',
        assetFileNames: 'moTimeline.[ext]',
      },
    },
  },
});
