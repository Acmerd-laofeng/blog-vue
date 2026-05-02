<template>
  <div class="articles">
    <ErrorBoundary :retry="articlesStore.retryLoad">
      <template #default>
        <div v-if="articlesStore.loading" class="loading-state">加载中...</div>
        <div v-else-if="articlesStore.error" class="error-state">
          <div class="error-icon">💥</div>
          <h3>加载失败</h3>
          <p>{{ articlesStore.error }}</p>
          <button @click="articlesStore.retryLoad" class="btn-retry">🔄 重新加载</button>
        </div>
        <div v-else>
          <div class="articles__header">
            <h1>📝 文章列表</h1>
            <p>共 {{ articlesStore.articles.length }} 篇文章</p>
          </div>

          <div class="articles__grid">
            <div
              v-for="article in articlesStore.articles"
              :key="article.id"
              class="article-card"
              @click="$router.push(`/article/${article.id}`)"
            >
              <div class="article-card__image">
                <img
                  v-if="article.cover_url"
                  :src="article.cover_url"
                  :alt="article.title"
                />
                <div v-else class="article-card__placeholder">
                  <span>📝</span>
                </div>
              </div>
              <div class="article-card__footer">
                <h3 class="article-card__title">{{ article.title }}</h3>
                <div class="article-card__meta">
                  <span>{{ article.date }}</span>
                  <span v-if="article.category">{{ article.category }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="articlesStore.articles.length === 0" class="empty-state">
            <p>暂无文章，<router-link to="/login">登录后台</router-link>发布第一篇</p>
          </div>
        </div>
      </template>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { useArticlesStore } from '../stores/articles'
const articlesStore = useArticlesStore()
</script>

<style scoped>
.articles {
  max-width: 1464px;
  margin: 0 auto;
  padding: 24px 20px;
}

.articles__header {
  margin-bottom: 24px;
}

.articles__header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 4px;
}

.articles__header p {
  color: #666;
}

.articles__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1100px) {
  .articles__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .articles__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .articles__grid {
    grid-template-columns: 1fr;
  }
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.article-card__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-card__image:has(.article-card__placeholder) {
  aspect-ratio: auto;
  height: 120px;
}

.article-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-card__image img {
  transform: scale(1.05);
}

.article-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
}

.article-card__footer {
  padding: 12px 16px;
  background: #1a1a2e;
  color: white;
  min-height: 60px;
}

.article-card__title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__meta {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: white;
  border-radius: 12px;
}

.empty-state a {
  color: #2C54FB;
  font-weight: 600;
}

/* 加载/错误状态 */
.loading-state, .error-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.error-state h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.btn-retry {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: var(--accent-hover);
}

/* 修复无封面图卡片过高 */
.article-card:has(.article-card__placeholder) .article-card__image {
  aspect-ratio: auto;
  height: 120px;
}
</style>
