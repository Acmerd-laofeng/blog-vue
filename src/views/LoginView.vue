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
            placeholder="至少 6 位字符" 
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const loading = ref(false)
const message = ref('')
const errorType = ref(false) // false = success, true = error

const form = ref({
  email: '',
  password: '',
  username: ''
})

function toggleMode() {
  isRegister.value = !isRegister.value
  message.value = ''
  form.value = { email: '', password: '', username: '' }
}

async function handleSubmit() {
  loading.value = true
  message.value = ''
  
  try {
    if (isRegister.value) {
      await authStore.register(form.value.email, form.value.password, form.value.username)
      message.value = '注册成功！正在登录...'
      setTimeout(() => router.push('/'), 1000)
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
  background: #f5f7fa;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #2C54FB;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
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
  color: #f44336;
}

.message.success {
  color: #4caf50;
}

.auth-toggle {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.auth-toggle a {
  color: #2C54FB;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}
</style>
