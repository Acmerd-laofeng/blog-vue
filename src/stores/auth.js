import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const ADMIN_PASSWORD = '20011228fqh'

  function login(password) {
    if (password === ADMIN_PASSWORD) {
      isLoggedIn.value = true
      localStorage.setItem('acmerd-auth', 'true')
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    localStorage.removeItem('acmerd-auth')
  }

  function checkAuth() {
    isLoggedIn.value = localStorage.getItem('acmerd-auth') === 'true'
  }

  return { isLoggedIn, login, logout, checkAuth }
})
