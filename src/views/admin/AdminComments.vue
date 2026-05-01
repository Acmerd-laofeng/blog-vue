<template>
  <div class="admin-comments">
    <div class="admin-comments__header">
      <h1>💬 评论管理</h1>
      <router-link to="/admin/dashboard" class="back-link">← 返回仪表盘</router-link>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 搜索用户名、评论内容..." 
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="filteredComments.length === 0" class="empty-state">
      <p>{{ searchQuery ? '未找到匹配的评论' : '暂无评论' }}</p>
    </div>

    <div v-else class="comments-table">
      <div class="comments-table__header">
        <span class="col-user">用户</span>
        <span class="col-content">内容</span>
        <span class="col-actions">操作</span>
      </div>

      <div v-for="comment in filteredComments" :key="comment.id" class="comment-row">
        <div class="col-user">
          <div class="user-name">{{ comment.user_name }}</div>
          <div class="user-date">{{ formatDate(comment.created_at) }}</div>
        </div>
        <div class="col-content">
          <p class="content-text">{{ comment.content }}</p>
        </div>
        <div class="col-actions">
          <button @click="removeComment(comment)" class="btn btn--small btn--danger">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { commentService } from '../../services/commentService'

const comments = ref([])
const loading = ref(true)
const searchQuery = ref('')

const filteredComments = computed(() => {
  if (!searchQuery.value) return comments.value
  const q = searchQuery.value.toLowerCase()
  return comments.value.filter(comment => 
    (comment.user_name && comment.user_name.toLowerCase().includes(q)) || 
    (comment.content && comment.content.toLowerCase().includes(q))
  )
})

async function loadComments() {
  loading.value = true
  comments.value = await commentService.getAll()
  loading.value = false
}

async function removeComment(comment) {
  if (!confirm(`确定删除来自 "${comment.user_name}" 的评论吗？`)) return
  
  try {
    await commentService.remove(comment.id)
    await loadComments()
    alert('评论已删除')
  } catch (error) {
    alert('删除失败：' + error.message)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.admin-comments {
  padding: 32px;
}

.admin-comments__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-comments__header h1 {
  font-size: 1.5rem;
  color: #333;
}

.back-link {
  color: #667eea;
  text-decoration: none;
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
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

.comments-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
}

.comments-table__header {
  display: grid;
  grid-template-columns: 150px 1fr 100px;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
}

.comment-row {
  display: grid;
  grid-template-columns: 150px 1fr 100px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background 0.2s;
}

.comment-row:last-child {
  border-bottom: none;
}

.comment-row:hover {
  background: #f9f9f9;
}

.user-name {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
}

.user-date {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
}

.content-text {
  color: #444;
  font-size: 0.85rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.col-actions {
  display: flex;
  gap: 6px;
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

.btn--danger {
  background: #f44336;
  color: white;
}

@media (max-width: 768px) {
  .comments-table__header {
    display: none;
  }

  .comment-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px;
  }

  .col-actions {
    margin-top: 8px;
  }
}
</style>
