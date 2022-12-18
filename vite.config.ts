import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/assets/',
  plugins: [vue()],
  build: {
		rollupOptions: {
			input: {
				app: './src/main.ts',
			},
    },
    modulePreload: {
      polyfill: true,
    },
		manifest: 'manifest.json',
		cssCodeSplit: true,
    outDir: 'built',
    assetsDir: '.',
    emptyOutDir: true,
  },
})
 