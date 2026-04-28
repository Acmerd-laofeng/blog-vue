<template>
  <div class="login">
    <div class="login__card">
      <h1 class="login__title">🔐 Acmerd 管理后台</h1>
      <p class="login__desc">请输入管理密码继续</p>
      
      <form @submit.prevent="handleLogin" class="login__form">
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入管理密码"
            class="form-input"
            autofocus
          />
        </div>
        <p v-if="error" class="login__error">{{ error }}</p>
        <button type="submit" class="btn btn--primary">登录</button>
      </form>

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
const password = ref('')
const error = ref('')

function handleLogin() {
  if (authStore.login(password.value)) {
    error.value = ''
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  } else {
    error.value = '密码错误，请重试'
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

.login__form {
  margin-bottom: 24px;
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

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn--primary:hover {
  opacity: 0.9;
}

.login__back {
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>
