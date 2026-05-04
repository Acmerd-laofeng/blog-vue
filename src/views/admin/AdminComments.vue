<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">评论管理</h1>
    </div>

    <!-- 工具栏：搜索与排序 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon"><Icon name="search" /></span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索用户名、评论内容..." 
          class="search-input"
        />
      </div>
      
      <div class="sort-box">
        <span class="sort-label">排序：</span>
        <select v-model="sortKey" class="sort-select">
          <option value="date-desc">最新发布</option>
          <option value="date-asc">最早发布</option>
        </select>
      </div>
    </div>

    <!-- 列表 -->
    <div class="card-list">
      <div v-for="comment in filteredAndSortedComments" :key="comment.id" class="card">
        <div class="card__header">
          <div class="user-info">
            <div class="avatar">{{ comment.user_name?.charAt(0).toUpperCase() || 'C' }}</div>
            <div class="text">
              <h3 class="name">{{ comment.user_name }}</h3>
              <span class="date">{{ formatDate(comment.created_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="card__body">
          <p class="content">{{ comment.content }}</p>
        </div>

        <div class="card__footer">
          <button @click="removeComment(comment)" class="action-link action-link--danger">
            <Icon name="trash" /> 删除
          </button>
        </div>
      </div>
      
      <div v-if="filteredAndSortedComments.length === 0" class="empty-state">
        <span class="empty-icon">💬</span>
        <p>没有找到相关评论</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { commentService } from '../../services/commentService'

const comments = ref([])
const searchQuery = ref('')
const sortKey = ref('date-desc')

// 过滤与排序逻辑
const filteredAndSortedComments = computed(() => {
  let result = [...comments.value]

  // 1. 搜索
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      (c.user_name && c.user_name.toLowerCase().includes(q)) || 
      (c.content && c.content.toLowerCase().includes(q))
    )
  }

  // 2. 排序
  result.sort((a, b) => {
    if (sortKey.value === 'date-desc') return new Date(b.created_at) - new Date(a.created_at)
    if (sortKey.value === 'date-asc') return new Date(a.created_at) - new Date(b.created_at)
    return 0
  })

  return result
})

async function loadComments() {
  comments.value = await commentService.getAll()
}

async function removeComment(comment) {
  if (confirm(`确定删除来自 "${comment.user_name}" 的评论吗？`)) {
    await commentService.remove(comment.id)
    await loadComments()
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadComments()
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
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #0071e3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.text .name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1d1d1f;
}

.text .date {
  font-size: 0.8rem;
  color: #86868b;
}

.card__body {
  padding: 0 20px 16px;
  flex: 1;
}

.content {
  margin: 0;
  color: #1d1d1f;
  line-height: 1.5;
  font-size: 0.95rem;
}

.card__footer {
  padding: 16px 20px;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
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

.action-link--danger {
  color: #ff3b30;
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
