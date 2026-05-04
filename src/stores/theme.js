// src/stores/theme.js
// 主题管理 - 亮色/暗黑模式切换

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // 初始化：从 localStorage 读取或跟随系统偏好
  function init() {
    const saved = localStorage.getItem('acmerd-theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // 跟随系统偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // 切换主题
  function toggle() {
    isDark.value = !isDark.value
    applyTheme()
    localStorage.setItem('acmerd-theme', isDark.value ? 'dark' : 'light')
  }

  // 设置主题（支持 v-model）
  function setTheme(value) {
    if (isDark.value !== value) {
      isDark.value = value
      applyTheme()
      localStorage.setItem('acmerd-theme', value ? 'dark' : 'light')
    }
  }

  // 应用主题到 body
  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, init, toggle, setTheme }
})
