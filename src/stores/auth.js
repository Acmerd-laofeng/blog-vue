import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!session.value)
  const isAdmin = computed(() => user.value?.email === '1902768564@qq.com')

  async function signInWithGitHub() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/admin/dashboard'
        }
      })
      if (error) throw error
    } finally {
      loading.value = false
    }
  }

  async function signInWithEmail(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      session.value = data.session
      user.value = data.user
      return true
    } finally {
      loading.value = false
    }
  }

  async function signUpWithEmail(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('退出登录失败:', error)
    session.value = null
    user.value = null
  }

  async function checkAuth() {
    const { data: { session: currentSession }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('获取会话失败:', error)
      return
    }
    session.value = currentSession
    user.value = currentSession?.user || null
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange((event, currentSession) => {
    session.value = currentSession
    user.value = currentSession?.user || null
    
    if (event === 'SIGNED_IN') {
      localStorage.setItem('acmerd-auth', 'true')
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('acmerd-auth')
    }
  })

  // 初始化时检查
  checkAuth()

  return {
    user,
    session,
    loading,
    isLoggedIn,
    isAdmin,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    checkAuth
  }
})
