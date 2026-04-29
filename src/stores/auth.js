import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!session.value)
  const isAdmin = computed(() => user.value?.email === '1902768564@qq.com')

  // 管理员邮箱白名单
  const ADMIN_EMAILS = ['1902768564@qq.com']

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
      
      // 检查是否为管理员
      if (!ADMIN_EMAILS.includes(data.user.email)) {
        await supabase.auth.signOut()
        throw new Error('您没有管理权限')
      }
      
      session.value = data.session
      user.value = data.user
      return true
    } finally {
      loading.value = false
    }
  }

  // 注册功能已关闭（仅管理员可登录）
  async function signUpWithEmail(email, password) {
    throw new Error('注册功能已关闭，请联系管理员')
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
    ADMIN_EMAILS,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    checkAuth
  }
})
