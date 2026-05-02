import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ErrorBoundary from './components/ErrorBoundary.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// 注册全局错误边界组件
app.component('ErrorBoundary', ErrorBoundary)

app.use(pinia)
app.use(router)

// 全局错误捕获 (防止组件崩溃导致白屏)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue Error:', err, info)
  // 可以在这里上报 Sentry 或其他监控服务
}

app.mount('#app')
