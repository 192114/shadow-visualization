import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3001,
  },
  css: {
    modules: {
      generateScopedName: '[name]_[local]--[hash:base64:5]',
    },
  },
})
