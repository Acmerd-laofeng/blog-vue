import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const initialized = ref(false)
  
  // 白名单邮箱
  const adminEmail = '1902768564@qq.com'

  // 判断是否为管理员
  const isAdmin = computed(() => {
    return user.value?.email === adminEmail
  })

  // 安全初始化：防止崩溃
  const init = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Supabase Auth Init Error:', error)
        return
      }
      if (session) {
        user.value = session.user
      }
      
      // 监听状态变化
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
    } catch (err) {
      console.error("Auth store init failed:", err)
    } finally {
      initialized.value = true
    }
  }

  // 启动初始化
  init().catch(err => console.error("Unhandled auth init error:", err))

  // 注册功能
  async function register(email, password, username) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      })

      if (error) throw error
      return data
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登录功能
  async function login(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user
      return data
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // 登出功能
  async function logout() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return { user, loading, isAdmin, initialized, register, login, logout }
})
