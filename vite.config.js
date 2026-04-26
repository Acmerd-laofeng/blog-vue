import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          // 关键部分：将 .md 文件转为字符串，避免被当成 JS 解析
          name: 'md-as-text',
          transform(code, id) {
            if (id.endsWith('.md')) {
              return {
                code: `export default ${JSON.stringify(code)}`,
                map: null
              }
            }
          }
        }
      ]
    }
  }
})
