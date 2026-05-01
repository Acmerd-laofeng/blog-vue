<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">{{ isRegister ? '注册新账号' : '欢迎回来' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- 注册专属字段 -->
        <div v-if="isRegister" class="form-group">
          <label>昵称</label>
          <input 
            v-model="form.username" 
            type="text" 
            placeholder="给自己起个响亮的名字" 
            required 
          />
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="your@email.com" 
            required 
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            :placeholder="isRegister ? '字母 + 数字/符号 (6 位以上)' : '请输入密码'" 
            required 
            autocomplete="new-password"
          />
          <span v-if="isRegister && form.password" class="pwd-hint">
            {{ passwordStatus }}
          </span>
        </div>

        <!-- 注册时显示确认密码 -->
        <div v-if="isRegister" class="form-group">
          <label>确认密码</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="再次输入密码" 
            required 
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '处理中...' : (isRegister ? '立即注册' : '登录') }}
        </button>

        <p v-if="message" class="message" :class="errorType ? 'error' : 'success'">
          {{ message }}
        </p>
      </form>

      <div class="auth-toggle">
        <span>{{ isRegister ? '已经有账号了？' : '还没有账号？' }}</span>
        <a href="#" @click.prevent="toggleMode">{{ isRegister ? '去登录' : '去注册' }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const loading = ref(false)
const message = ref('')
const errorType = ref(false)

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  username: ''
})

function toggleMode() {
  isRegister.value = !isRegister.value
  message.value = ''
  form.value = { email: '', password: '', confirmPassword: '', username: '' }
}

// 密码复杂度校验：字母、数字、特殊字符至少包含两种
const passwordStatus = computed(() => {
  const pwd = form.value.password
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
  
  const count = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0)
  
  if (count >= 2 && pwd.length >= 6) return '✅ 密码强度合格'
  if (pwd.length < 6) return '❌ 长度至少 6 位'
  return '❌ 需包含字母/数字/符号中的至少两种'
})

function isPasswordValid(pwd) {
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
  const count = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0)
  return count >= 2 && pwd.length >= 6
}

async function handleSubmit() {
  loading.value = true
  message.value = ''
  errorType.value = false
  
  try {
    if (isRegister.value) {
      // 1. 校验密码一致性
      if (form.value.password !== form.value.confirmPassword) {
        throw new Error('两次输入的密码不一致')
      }
      
      // 2. 校验密码强度
      if (!isPasswordValid(form.value.password)) {
        throw new Error('密码强度不足：需包含字母、数字、特殊字符中至少两种，且长度≥6')
      }

      // 3. 调用注册
      await authStore.register(form.value.email, form.value.password, form.value.username)
      message.value = '注册成功！正在跳转...'
      setTimeout(() => router.push('/'), 1500)
    } else {
      await authStore.login(form.value.email, form.value.password)
      router.push('/')
    }
  } catch (err) {
    message.value = err.message || '操作失败，请检查输入'
    errorType.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f7;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  color: #1d1d1f;
  margin-bottom: 24px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #1d1d1f;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-group input:focus {
  background: #ffffff;
  border-color: #2C54FB;
}

.pwd-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #ff3b30;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #2C54FB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  margin-top: 8px;
}

.btn-submit:hover {
  background: #1a42e6;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  text-align: center;
  font-size: 0.9rem;
}

.message.error {
  color: #ff3b30;
}

.message.success {
  color: #34c759;
}

.auth-toggle {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
  color: #86868b;
}

.auth-toggle a {
  color: #2C54FB;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}
</style>
