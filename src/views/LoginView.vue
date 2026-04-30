<template>
  <div class="login">
    <div class="login__card">
      <h1 class="login__title">🔐 Acmerd 管理后台</h1>
      <p class="login__desc">选择登录方式</p>
      
      <div class="login__methods">
        <!-- GitHub 登录 -->
        <button @click="handleGitHubLogin" class="btn btn--github" :disabled="authStore.loading">
          <svg class="btn__icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          {{ authStore.loading ? '登录中...' : 'GitHub 登录' }}
        </button>

        <div class="login__divider">
          <span>或</span>
        </div>

        <!-- 邮箱密码登录 -->
        <form @submit.prevent="handleEmailLogin" class="login__form" autocomplete="off">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱"
              required
              autocomplete="off"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              required
              autocomplete="off"
            />
          </div>
          <p v-if="error" class="login__error">{{ error }}</p>
          <div class="login__actions">
            <button type="submit" class="btn btn--primary" :disabled="authStore.loading">
              {{ authStore.loading ? '登录中...' : '登录' }}
            </button>
            <button type="button" @click="handleSignUp" class="btn btn--secondary" :disabled="authStore.loading">
              {{ authStore.loading ? '处理中...' : '注册' }}
            </button>
          </div>
        </form>
      </div>

      <router-link to="/" class="login__back">← 返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleGitHubLogin() {
  try {
    await authStore.signInWithGitHub()
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  } catch (err) {
    error.value = 'GitHub 登录失败：' + err.message
  }
}

async function handleEmailLogin() {
  try {
    const success = await authStore.signInWithEmail(email.value, password.value)
    if (success) {
      error.value = ''
      const redirect = route.query.redirect || '/admin/dashboard'
      router.push(redirect)
    }
  } catch (err) {
    error.value = '登录失败：' + err.message
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login__card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.login__title {
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.login__desc {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.login__methods {
  margin-bottom: 24px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn--github {
  background: #24292e;
  color: white;
}

.btn--github:hover {
  background: #2f363d;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn--primary:hover {
  opacity: 0.9;
}

.btn--primary:disabled, .btn--github:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__icon {
  fill: currentColor;
}

.login__divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #999;
  font-size: 0.9rem;
}

.login__divider::before,
.login__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.login__divider span {
  padding: 0 16px;
}

.login__form {
  margin-top: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.login__error {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-bottom: 12px;
  text-align: center;
}

.login__back {
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.login__back:hover {
  text-decoration: underline;
}
</style>
