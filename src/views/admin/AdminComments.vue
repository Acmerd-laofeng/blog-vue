<template>
  <div class="admin-comments">
    <div class="admin-comments__header">
      <h1>💬 评论管理</h1>
      <router-link to="/admin/dashboard" class="back-link">← 返回仪表盘</router-link>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="comments.length === 0" class="empty-state">
      <p>暂无评论</p>
    </div>

    <div v-else class="comments-table">
      <div class="comments-table__header">
        <span class="col-user">用户</span>
        <span class="col-article">文章</span>
        <span class="col-content">内容</span>
        <span class="col-status">状态</span>
        <span class="col-actions">操作</span>
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-row" :class="{ 'comment-row--pinned': comment.is_pinned }">
        <div class="col-user">
          <div class="user-name">{{ comment.user_name }}</div>
          <div class="user-date">{{ formatDate(comment.created_at) }}</div>
        </div>
        <div class="col-article">
          <router-link :to="`/article/${comment.article_id}`" class="article-link" target="_blank">
            {{ comment.articles?.title || `ID: ${comment.article_id}` }}
          </router-link>
        </div>
        <div class="col-content">
          <p class="content-text">{{ comment.content }}</p>
        </div>
        <div class="col-status">
          <span class="status-badge" :class="comment.is_approved ? 'status--approved' : 'status--pending'">
            {{ comment.is_approved ? '已发布' : '待审核' }}
          </span>
          <span v-if="comment.is_pinned" class="status-badge status--pinned">📌 置顶</span>
        </div>
        <div class="col-actions">
          <button @click="toggleApprove(comment)" class="btn btn--small" :class="comment.is_approved ? 'btn--warning' : 'btn--success'">
            {{ comment.is_approved ? '隐藏' : '通过' }}
          </button>
          <button @click="togglePin(comment)" class="btn btn--small btn--info">
            {{ comment.is_pinned ? '取消置顶' : '置顶' }}
          </button>
          <button @click="removeComment(comment)" class="btn btn--small btn--danger">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commentService } from '../../services/commentService'

const comments = ref([])
const loading = ref(true)

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

async function toggleApprove(comment) {
  try {
    await commentService.toggleApprove(comment.id, comment.is_approved)
    await loadComments()
  } catch (error) {
    alert('操作失败：' + error.message)
  }
}

async function togglePin(comment) {
  try {
    await commentService.togglePin(comment.id, comment.is_pinned)
    await loadComments()
  } catch (error) {
    alert('操作失败：' + error.message)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
  grid-template-columns: 120px 150px 1fr 100px 280px;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
}

.comment-row {
  display: grid;
  grid-template-columns: 120px 150px 1fr 100px 280px;
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

.comment-row--pinned {
  background: #fff8e1;
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

.article-link {
  color: #333;
  text-decoration: none;
  font-size: 0.85rem;
}

.article-link:hover {
  color: #667eea;
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

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 4px;
}

.status--approved {
  background: #e8f5e9;
  color: #2e7d32;
}

.status--pending {
  background: #fff3e0;
  color: #ef6c00;
}

.status--pinned {
  background: #e3f2fd;
  color: #1565c0;
}

.col-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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

.btn:hover {
  opacity: 0.85;
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
  .comments-table__header {
    display: none;
  }

  .comment-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px;
  }

  .col-user, .col-article, .col-content, .col-status, .col-actions {
    grid-column: 1 / -1;
  }

  .col-actions {
    margin-top: 8px;
  }
}
</style>
