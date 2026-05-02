<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
    </div>

    <!-- 工具栏：搜索与排序 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索用户名、邮箱、UID..." 
          class="search-input"
        />
      </div>
      
      <div class="sort-box">
        <span class="sort-label">排序：</span>
        <select v-model="sortKey" class="sort-select">
          <option value="date-desc">最近注册</option>
          <option value="date-asc">最早注册</option>
        </select>
      </div>
    </div>

    <!-- 列表 -->
    <div class="card-list">
      <div v-for="user in filteredAndSortedUsers" :key="user.id" class="card">
        <div class="card__header">
          <div class="user-info">
            <div class="avatar">{{ user.username?.charAt(0).toUpperCase() || 'U' }}</div>
            <div class="text">
              <h3 class="name">{{ user.username || '未设置昵称' }}</h3>
              <span class="email">{{ user.email }}</span>
            </div>
          </div>
          <span class="badge" :class="user.is_admin ? 'badge--admin' : 'badge--user'">
            {{ user.is_admin ? '管理员' : '普通用户' }}
          </span>
        </div>
        
        <div class="card__body">
          <div class="info-row">
            <span class="label">UID</span>
            <span class="value uid-text" :title="user.uid">{{ user.uid || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">注册时间</span>
            <span class="value">{{ formatDate(user.created_at) }}</span>
          </div>
          <div class="info-row">
            <span class="label">昵称修改次数</span>
            <span class="value" :class="{ 'text-warning': user.nickname_changes_left <= 1 }">
              {{ user.nickname_changes_left || 0 }} 次
            </span>
          </div>
          <div class="info-row">
            <span class="label">状态</span>
            <span class="value" :class="{ 'text-danger': user.is_banned }">
              {{ user.is_banned ? '🚫 已禁言' : '✅ 正常' }}
            </span>
          </div>
        </div>

        <div class="card__footer">
          <button @click="resetNicknameChanges(user)" class="action-link" title="重置昵称修改次数">
            🔄 重置昵称次数
          </button>
          <button @click="toggleAdmin(user)" class="action-link">
            {{ user.is_admin ? '👎 取消管理' : '👑 设为管理' }}
          </button>
          <button @click="toggleBan(user)" class="action-link" :class="user.is_banned ? 'text-success' : 'text-danger'">
            {{ user.is_banned ? '🔓 解禁' : '🔒 禁言' }}
          </button>
        </div>
      </div>
      
      <div v-if="filteredAndSortedUsers.length === 0" class="empty-state">
        <span class="empty-icon">👥</span>
        <p>没有找到相关用户</p>
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
const searchQuery = ref('')
const sortKey = ref('date-desc')

// 过滤与排序逻辑
const filteredAndSortedUsers = computed(() => {
  let result = [...users.value]

  // 1. 搜索
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(u => 
      (u.username && u.username.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.uid && u.uid.toLowerCase().includes(q))
    )
  }

  // 2. 排序 (按 id 排序，UUID 大致按时间顺序)
  result.sort((a, b) => {
    if (sortKey.value === 'date-desc') return b.id.localeCompare(a.id)
    if (sortKey.value === 'date-asc') return a.id.localeCompare(b.id)
    return 0
  })

  return result
})

async function loadUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  
  if (error) {
    console.error('获取用户列表失败:', error)
  } else {
    users.value = data || []
  }
}

async function toggleAdmin(user) {
  if (!authStore.isAdmin) return
  const newStatus = !user.is_admin
  const { error } = await supabase.from('profiles').update({ is_admin: newStatus }).eq('id', user.id)
  if (!error) user.is_admin = newStatus
}

async function toggleBan(user) {
  if (!authStore.isAdmin) return
  const newStatus = !user.is_banned
  const { error } = await supabase.from('profiles').update({ is_banned: newStatus }).eq('id', user.id)
  if (!error) user.is_banned = newStatus
}

async function resetNicknameChanges(user) {
  if (!authStore.isAdmin) return
  const { error } = await supabase
    .from('profiles')
    .update({ nickname_changes_left: 3 })
    .eq('id', user.id)
  if (!error) {
    user.nickname_changes_left = 3
    alert(`已将 ${user.username || user.email} 的昵称修改次数重置为 3 次`)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* Apple 风格变量 */
:root {
  --apple-bg: #f5f5f7;
  --apple-card: #ffffff;
  --apple-text: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-blue: #0071e3;
  --apple-red: #ff3b30;
  --apple-green: #34c759;
  --apple-radius: 12px;
}

.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: #e8e8ed;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1d1d1f;
  outline: none;
  transition: background 0.2s;
}

.search-input:focus {
  background: #d2d2d7;
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 0.9rem;
  color: #86868b;
}

.sort-select {
  padding: 8px 12px;
  background: #e8e8ed;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1d1d1f;
  cursor: pointer;
  outline: none;
}

/* 卡片列表 */
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
}

.card__header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #0071e3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.text .name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
}

.text .email {
  font-size: 0.8rem;
  color: #86868b;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--admin { background: #e8f5e9; color: #2e7d32; }
.badge--user { background: #f5f5f7; color: #86868b; }

.card__body {
  padding: 0 20px 16px;
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f5f5f7;
  font-size: 0.9rem;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #86868b;
}

.value {
  color: #1d1d1f;
  font-weight: 500;
}

.text-danger { color: #ff3b30 !important; }
.text-success { color: #34c759 !important; }
.text-warning { color: #ff9500 !important; }

.uid-text {
  font-family: monospace;
  font-size: 0.8rem;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card__footer {
  padding: 16px 20px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f5f5f7;
}

.action-link {
  font-size: 0.85rem;
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.action-link:hover {
  text-decoration: underline;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #86868b;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>
