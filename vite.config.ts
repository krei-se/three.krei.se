/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite';

export default defineConfig((configEnv) => {
  return {
    build: {
        outDir: '/mnt/cloud/a1/www/krei.se/',
        emptyOutDir: true
    },
    resolve: {
      alias: {
        src: "/src",
        Kreise: "/src/Kreise",
        textures: "/src/textures",
        helpers: "/src/helpers",
        models: "/public/models"
      },
    }
  }  
});