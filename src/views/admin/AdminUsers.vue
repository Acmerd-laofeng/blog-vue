<template>
  <div class="admin-users">
    <div class="admin-users__header">
      <h1>👥 用户管理</h1>
      <router-link to="/admin/dashboard" class="back-link">← 返回仪表盘</router-link>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 搜索用户名或邮箱..." 
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>暂无用户</p>
    </div>

    <div v-else class="users-table">
      <div class="users-table__header">
        <span class="col-user">用户</span>
        <span class="col-email">邮箱</span>
        <span class="col-status">状态</span>
        <span class="col-actions">操作</span>
      </div>

      <div v-for="user in filteredUsers" :key="user.id" class="user-row" :class="{ 'row--banned': user.is_banned }">
        <div class="col-user">
          <div class="user-name">{{ user.username || '未设置昵称' }}</div>
          <div class="user-date">注册于 {{ formatDate(user.updated_at) }}</div>
        </div>
        <div class="col-email">
          <span v-if="user.email" class="email-text">{{ maskEmail(user.email) }}</span>
          <span v-else>-</span>
        </div>
        <div class="col-status">
          <span v-if="user.is_banned" class="badge badge--banned">🚫 禁言</span>
          <span v-else-if="user.is_admin" class="badge badge--admin">管理员</span>
          <span v-else class="badge badge--user">普通用户</span>
        </div>
        <div class="col-actions">
          <button 
            @click="toggleAdmin(user)" 
            class="btn btn--small" 
            :class="user.is_admin ? 'btn--warning' : 'btn--info'"
          >
            {{ user.is_admin ? '取消管理' : '设为管理' }}
          </button>
          <button 
            @click="toggleBan(user)" 
            class="btn btn--small btn--danger"
          >
            {{ user.is_banned ? '解禁' : '禁言' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loading = ref(true)
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    (user.username && user.username.toLowerCase().includes(q)) || 
    (user.email && user.email.toLowerCase().includes(q))
  )
})

// 邮箱脱敏
function maskEmail(email) {
  if (!email) return ''
  const [name, domain] = email.split('@')
  return name.charAt(0) + '***@' + domain
}

async function loadUsers() {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('获取用户列表失败:', error)
  } else {
    users.value = data || []
  }
  loading.value = false
}

async function toggleAdmin(user) {
  if (!authStore.isAdmin) return

  const newStatus = !user.is_admin
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: newStatus })
    .eq('id', user.id)

  if (error) {
    alert('操作失败：' + error.message)
  } else {
    user.is_admin = newStatus
  }
}

async function toggleBan(user) {
  if (!authStore.isAdmin) return

  const newStatus = !user.is_banned
  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: newStatus })
    .eq('id', user.id)

  if (error) {
    alert('操作失败：' + error.message)
  } else {
    user.is_banned = newStatus
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 32px;
}

.admin-users__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-users__header h1 {
  font-size: 1.5rem;
  color: #333;
}

.back-link {
  color: #667eea;
  text-decoration: none;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  color: #999;
}

.users-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
}

.users-table__header {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 260px;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
}

.user-row {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 260px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background 0.2s;
}

.user-row:last-child {
  border-bottom: none;
}

/* 禁言用户行变灰 */
.row--banned {
  background: #fff0f0;
  opacity: 0.7;
}

.user-name {
  font-weight: 600;
  color: #667eea;
}

.user-date {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
}

.email-text {
  font-family: monospace;
  color: #666;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge--admin {
  background: #e3f2fd;
  color: #1565c0;
}

.badge--user {
  background: #f5f5f5;
  color: #666;
}

.badge--banned {
  background: #ffebee;
  color: #c62828;
}

.col-actions {
  display: flex;
  gap: 8px;
}

.btn {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn--small {
  padding: 4px 8px;
  font-size: 0.75rem;
}

.btn--success {
  background: #4caf50;
  color: white;
}

.btn--warning {
  background: #ff9800;
  color: white;
}

.btn--danger {
  background: #f44336;
  color: white;
}

.btn--info {
  background: #2196f3;
  color: white;
}

@media (max-width: 1024px) {
  .users-table__header {
    display: none;
  }

  .user-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px;
  }

  .col-actions {
    margin-top: 8px;
  }
}
</style>
