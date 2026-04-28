<template>
  <div class="articles">
    <div class="articles__header">
      <h1>📝 文章列表</h1>
      <p>共 {{ articlesStore.articles.length }} 篇文章</p>
    </div>

    <div class="articles__list">
      <div
        v-for="article in articlesStore.articles"
        :key="article.id"
        class="article-item"
        @click="$router.push(`/article/${article.id}`)"
      >
        <h3 class="article-item__title">{{ article.title }}</h3>
        <p class="article-item__summary">{{ article.summary }}</p>
        <div class="article-item__meta">
          <span>📅 {{ article.date }}</span>
          <span v-if="article.category" class="tag">{{ article.category }}</span>
        </div>
      </div>
      <div v-if="articlesStore.articles.length === 0" class="empty-state">
        <p>暂无文章，<router-link to="/login">登录后台</router-link>发布第一篇</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useArticlesStore } from '../stores/articles'
const articlesStore = useArticlesStore()
</script>

<style scoped>
.articles {
  max-width: 800px;
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

.article-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.article-item__title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.article-item__summary {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 12px;
  line-height: 1.6;
}

.article-item__meta {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #999;
}

.tag {
  padding: 2px 10px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #555;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  background: white;
  border-radius: 12px;
}

.empty-state a {
  color: #667eea;
  font-weight: 600;
}
</style>
