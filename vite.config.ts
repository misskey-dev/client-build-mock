import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command, ssrBuild }) => ({
  base: '/assets/',
  plugins: [vue()],
  build: {
		rollupOptions: {
    },
    modulePreload: {
      polyfill: true,
    },
		manifest: 'manifest.json',
		cssCodeSplit: true,
    //outDir: 'built',
    assetsDir: '.',
    emptyOutDir: true,
  },
}));
 