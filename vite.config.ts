import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.aistudio') continue;
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'serve-root-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/assets/')) {
            const pathname = req.url.split('?')[0];
            const filePath = path.join(__dirname, pathname);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.mp4': 'video/mp4',
              };
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
      closeBundle() {
        const srcDir = path.join(__dirname, 'assets');
        const destDir = path.join(__dirname, 'dist', 'assets');
        if (fs.existsSync(srcDir)) {
          copyDirRecursive(srcDir, destDir);
        }
      }
    }, cloudflare()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});