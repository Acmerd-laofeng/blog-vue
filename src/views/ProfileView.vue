<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          {{ (nickname || authStore.user?.email || 'U').charAt(0).toUpperCase() }}
        </div>
        <div class="header-text">
          <h2>个人中心</h2>
          <span class="email-sub">{{ authStore.user?.email }}</span>
        </div>
      </div>

      <div class="profile-body">
        <div class="form-group">
          <label>昵称</label>
          <input 
            v-model="nickname" 
            type="text" 
            placeholder="输入你的昵称" 
            class="input-editable"
          />
        </div>

        <button @click="handleUpdate" class="btn-save" :disabled="loading">
          {{ loading ? '保存中...' : '保存修改' }}
        </button>
        
        <p v-if="message" :class="['message', messageType]">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'

const authStore = useAuthStore()
const nickname = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
  if (authStore.user) {
    // 优先从 metadata 取，如果没有就从 profiles 表取（这里简化直接从 metadata 取）
    nickname.value = authStore.user.user_metadata?.username || ''
  }
})

async function handleUpdate() {
  loading.value = true
  message.value = ''
  
  try {
    // 1. Update Auth Metadata (Username)
    const { error: authError } = await supabase.auth.updateUser({
      data: { username: nickname.value }
    })
    if (authError) throw authError

    // 2. Update Public Profile Table (If exists)
    // 注意：这里假设 profiles 表有 username 字段
    // 如果之前没建 profiles 表或者没加 username 字段，这里会失败但不影响 Auth metadata
    try {
       const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: nickname.value })
        .eq('id', authStore.user.id)
      
      if (profileError && profileError.code !== 'PGRST116') { 
        // PGRST116 is "not found", ignore if profile doesn't exist yet
        console.warn('Profile table update skipped:', profileError) 
      }
    } catch (e) {
      console.warn('Profile update ignored', e)
    }

    message.value = '保存成功！昵称已更新'
    messageType.value = 'success'
    
    // 强制刷新一下 store 里的显示（如果有的话）
  } catch (err) {
    message.value = '保存失败：' + err.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #f5f5f7;
}

.profile-card {
  background: white;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  overflow: hidden;
}

.profile-header {
  background: #2C54FB;
  color: white;
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-text h2 {
  margin: 0;
  font-size: 1.4rem;
}

.email-sub {
  font-size: 0.9rem;
  opacity: 0.8;
}

.profile-body {
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1d1d1f;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
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

.btn-save {
  width: 100%;
  padding: 14px;
  background: #2C54FB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #1a42e6;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  text-align: center;
  font-size: 0.9rem;
}

.success { color: #34c759; }
.error { color: #ff3b30; }
</style>
