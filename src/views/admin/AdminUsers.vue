<template>
  <div class="admin-users">
    <div class="admin-users__header">
      <h1>👥 用户管理</h1>
      <router-link to="/admin/dashboard" class="back-link">← 返回仪表盘</router-link>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>暂无用户</p>
    </div>

    <div v-else class="users-table">
      <div class="users-table__header">
        <span class="col-user">用户</span>
        <span class="col-email">邮箱</span>
        <span class="col-role">角色</span>
        <span class="col-actions">操作</span>
      </div>

      <div v-for="user in users" :key="user.id" class="user-row">
        <div class="col-user">
          <div class="user-name">{{ user.username || '未设置昵称' }}</div>
          <div class="user-date">注册于 {{ formatDate(user.updated_at) }}</div>
        </div>
        <div class="col-email">
          {{ user.email_masked }}
        </div>
        <div class="col-role">
          <span v-if="user.is_admin" class="badge badge--admin">管理员</span>
          <span v-else class="badge badge--user">普通用户</span>
        </div>
        <div class="col-actions">
          <button @click="toggleAdmin(user)" class="btn btn--small" :class="user.is_admin ? 'btn--warning' : 'btn--success'">
            {{ user.is_admin ? '取消管理' : '设为管理' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loading = ref(true)

async function loadUsers() {
  loading.value = true
  // 注意：普通用户只能看到公开信息，管理员可以看到更多
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
  // 只有当前登录的管理员才能操作
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
    // 如果改的是自己，顺便更新 store
    if (user.id === authStore.user?.id) {
      // 这里不自动更新 store 防止逻辑复杂，建议重新登录生效
    }
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
  grid-template-columns: 1fr 1fr 100px 200px;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
}

.user-row {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 200px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.user-row:last-child {
  border-bottom: none;
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
</style>
