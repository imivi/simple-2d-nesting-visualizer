import { defineConfig, type UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig((options) => {
  return {
    base: options.command !== "serve" ? "/simple-2d-nesting-visualizer/" : "/",
    plugins: [
      react(),
    ],
  }
})

/*
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  if (command !== 'serve') {
    config.base = '/simple-2d-nesting-visualizer/'
  }

  return config
})
*/