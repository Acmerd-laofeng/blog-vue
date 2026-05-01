import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  
  // 白名单邮箱
  const adminEmail = '1902768564@qq.com'

  // 判断是否为管理员
  const isAdmin = computed(() => {
    return user.value?.email === adminEmail
  })

  // 初始化：检查是否有已登录的 Session
  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      user.value = session.user
    }
    
    // 监听登录状态变化
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  }

  // 注册功能
  async function register(email, password, username) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // 写入 profile 表的 username 字段
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

  // 初始化
  init()

  return { user, loading, isAdmin, register, login, logout }
})
