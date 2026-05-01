<template>
  <div class="auth-page">
    <!-- 左侧：品牌展示区 (桌面端显示) -->
    <div class="auth-banner">
      <div class="banner-content">
        <h1>Acmerd</h1>
        <p class="banner-slogan">华子哥的秘密基地</p>
        <div class="banner-decoration">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
        </div>
      </div>
    </div>

    <!-- 右侧：表单区 -->
    <div class="auth-form-section">
      <div class="form-container">
        <div class="form-header">
          <h2>{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
          <p class="form-sub">{{ isRegister ? '注册以开始使用 Acmerd 的所有功能' : '请登录以访问您的账户' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- 注册专属字段 -->
          <div v-if="isRegister" class="form-group fade-in">
            <label class="input-label">昵称</label>
            <input 
              v-model="form.username" 
              type="text" 
              placeholder="给自己起个响亮的名字" 
              class="modern-input"
              required 
            />
          </div>

          <div class="form-group">
            <label class="input-label">邮箱</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="name@company.com" 
              class="modern-input"
              required 
              autocomplete="off"
            />
          </div>

          <div class="form-group">
            <label class="input-label">密码</label>
            <input 
              v-model="form.password" 
              type="password" 
              :placeholder="isRegister ? '字母 + 数字/符号 (6 位以上)' : '输入密码'" 
              class="modern-input"
              required 
              autocomplete="new-password"
            />
            <div v-if="isRegister" class="strength-hint">
              <span class="dot" :class="{ active: pwdStrength >= 1 }"></span>
              <span class="dot" :class="{ active: pwdStrength >= 2 }"></span>
              <span class="dot" :class="{ active: pwdStrength >= 3 }"></span>
            </div>
          </div>

          <!-- 注册时显示确认密码 -->
          <div v-if="isRegister" class="form-group fade-in">
            <label class="input-label">确认密码</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="再次输入密码" 
              class="modern-input"
              required 
              autocomplete="new-password"
            />
          </div>

          <div v-if="message" :class="['message-box', errorType ? 'error' : 'success']">
            {{ message }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '' : (isRegister ? '立即注册' : '登录') }}
          </button>
        </form>

        <div class="form-footer">
          <span>{{ isRegister ? '已经有账号了？' : '还没有账号？' }}</span>
          <button class="toggle-btn" @click="toggleMode">
            {{ isRegister ? '去登录' : '去注册' }}
          </button>
        </div>
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

// 密码强度检测
const pwdStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return 0
  let score = 0
  if (/[a-zA-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++
  if (pwd.length >= 8) score++ // 长度加分
  return Math.min(score, 3)
})

function toggleMode() {
  isRegister.value = !isRegister.value
  message.value = ''
  form.value = { email: '', password: '', confirmPassword: '', username: '' }
}

function isPasswordValid(pwd) {
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
  const strength = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0)
  return strength >= 2 && pwd.length >= 6
}

async function handleSubmit() {
  loading.value = true
  message.value = ''
  errorType.value = false
  
  try {
    if (isRegister.value) {
      if (form.value.password !== form.value.confirmPassword) throw new Error('两次输入的密码不一致')
      if (!isPasswordValid(form.value.password)) throw new Error('密码强度不足：需包含字母/数字/符号中的至少两种')

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
/* 页面布局 */
.auth-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 左侧品牌区 */
.auth-banner {
  flex: 1;
  background: linear-gradient(135deg, #2C54FB 0%, #1D39C4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.banner-content {
  text-align: center;
  z-index: 2;
  padding: 40px;
}

.banner-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
  filter: brightness(0) invert(1); /* 让 Logo 变白 */
}

.banner-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
}

.banner-slogan {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
  font-weight: 300;
}

/* 装饰圆圈 */
.banner-decoration .circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.c1 { width: 300px; height: 300px; top: -50px; left: -50px; }
.c2 { width: 400px; height: 400px; bottom: -100px; right: -100px; }

/* 右侧表单区 */
.auth-form-section {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.form-sub {
  color: #86868b;
  margin: 0;
  font-size: 1rem;
}

/* 现代表单样式 */
.form-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1d1d1f;
  font-size: 0.9rem;
}

.modern-input {
  width: 100%;
  padding: 14px 16px;
  background: #F5F5F7; /* Apple 风格浅灰背景 */
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 1rem;
  color: #1d1d1f;
  transition: all 0.2s;
  box-sizing: border-box;
}

.modern-input:focus {
  outline: none;
  background: #fff;
  border-color: #2C54FB;
  box-shadow: 0 0 0 4px rgba(44, 84, 251, 0.1);
}

.modern-input::placeholder {
  color: #999;
}

/* 密码强度指示器 */
.strength-hint {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.dot {
  flex: 1;
  height: 4px;
  background: #E5E5EA;
  border-radius: 2px;
  transition: background 0.3s;
}

.dot.active { background: #2C54FB; }

/* 消息提示 */
.message-box {
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
}
.message-box.error { background: #FFF0F0; color: #FF3B30; }
.message-box.success { background: #F0FFF4; color: #34C759; }

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: #2C54FB;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.submit-btn:hover { background: #1A42E6; }
.submit-btn:disabled { background: #999; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 底部切换 */
.form-footer {
  margin-top: 32px;
  text-align: center;
  color: #86868b;
  font-size: 0.95rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: #2C54FB;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  font-size: 0.95rem;
}

.toggle-btn:hover { text-decoration: underline; }

/* 动画 */
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* 移动端适配 */
@media (max-width: 768px) {
  .auth-banner { display: none; }
  .auth-form-section { padding: 24px; }
}
</style>
