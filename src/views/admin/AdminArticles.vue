<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">文章管理</h1>
      <div class="header-actions">
        <router-link to="/admin/articles/new" class="btn btn--primary">
          <span class="icon">＋</span> 写文章
        </router-link>
      </div>
    </div>

    <!-- 工具栏：搜索与排序 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索文章标题..." 
          class="search-input"
        />
      </div>
      
      <div class="sort-box">
        <span class="sort-label">排序：</span>
        <select v-model="sortKey" class="sort-select">
          <option value="date-desc">最新发布</option>
          <option value="date-asc">最早发布</option>
          <option value="views-desc">浏览量最多</option>
        </select>
      </div>
    </div>

    <!-- 列表 -->
    <div class="card-list">
      <div v-for="article in filteredAndSortedArticles" :key="article.id" class="card">
        <div class="card__cover">
          <img v-if="article.cover_url" :src="article.cover_url" :alt="article.title" />
          <div v-else class="card__placeholder">📝</div>
        </div>
        <div class="card__content">
          <div class="card__meta">
            <span class="tag">{{ article.category || '未分类' }}</span>
            <span class="date">{{ article.date }}</span>
            <span class="views">👀 {{ article.view_count || 0 }}</span>
          </div>
          <h3 class="card__title">{{ article.title }}</h3>
          <p class="card__summary">{{ article.summary || '暂无摘要' }}</p>
          <div class="card__actions">
            <router-link :to="`/admin/articles/edit/${article.id}`" class="action-link">
              ✏️ 编辑
            </router-link>
            <button @click="handleDelete(article)" class="action-link action-link--danger">
              🗑️ 删除
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredAndSortedArticles.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>没有找到相关文章</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useArticlesStore } from '../../stores/articles'

const articlesStore = useArticlesStore()
const searchQuery = ref('')
const sortKey = ref('date-desc')

// 过滤与排序逻辑
const filteredAndSortedArticles = computed(() => {
  let result = [...articlesStore.articles]

  // 1. 搜索
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.title.toLowerCase().includes(q) || 
      (a.summary && a.summary.toLowerCase().includes(q))
    )
  }

  // 2. 排序
  result.sort((a, b) => {
    if (sortKey.value === 'date-desc') return new Date(b.date) - new Date(a.date)
    if (sortKey.value === 'date-asc') return new Date(a.date) - new Date(b.date)
    if (sortKey.value === 'views-desc') return (b.view_count || 0) - (a.view_count || 0)
    return 0
  })

  return result
})

function handleDelete(article) {
  if (confirm(`确定要删除 "${article.title}" 吗？`)) {
    articlesStore.remove(article.id)
  }
}
</script>

<style scoped>
/* Apple 风格变量 */
:root {
  --apple-bg: #f5f5f7;
  --apple-card: #ffffff;
  --apple-text: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-blue: #0071e3;
  --apple-blue-hover: #0077ed;
  --apple-border: #d2d2d7;
  --apple-radius: 12px;
}

.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 980px; /* Pill shape */
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn--primary {
  background: #0071e3;
  color: white;
}

.btn--primary:hover {
  background: #0077ed;
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
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

.card__cover {
  height: 160px;
  background: #f5f5f7;
  overflow: hidden;
}

.card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, #f5f5f7, #e8e8ed);
}

.card__content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card__meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.8rem;
  color: #86868b;
}

.tag {
  background: #f5f5f7;
  padding: 2px 8px;
  border-radius: 4px;
  color: #1d1d1f;
  font-weight: 500;
}

.card__title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1d1d1f;
  line-height: 1.3;
}

.card__summary {
  font-size: 0.9rem;
  color: #86868b;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card__actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid #f5f5f7;
  padding-top: 16px;
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
