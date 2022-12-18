import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
		rollupOptions: {
			input: {
				app: './src/main.ts',
			},
    },
		manifest: 'manifest.json',
    outDir: 'built',
    assetsDir: '.',
    emptyOutDir: true,
  },
})
 