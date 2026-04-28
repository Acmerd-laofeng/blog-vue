<template>
  <div class="article-detail" v-if="article">
    <div class="article-detail__back">
      <router-link to="/articles">← 返回文章列表</router-link>
    </div>
    <article class="article-detail__content">
      <h1 class="article-detail__title">{{ article.title }}</h1>
      <div class="article-detail__meta">
        <span>📅 {{ article.date }}</span>
        <span v-if="article.category" class="tag">{{ article.category }}</span>
      </div>
      <div class="article-detail__body" v-html="renderedContent"></div>
    </article>
  </div>
  <div v-else class="not-found">
    <h2>文章不存在</h2>
    <router-link to="/articles">返回文章列表</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '../stores/articles'

const route = useRoute()
const articlesStore = useArticlesStore()
const article = computed(() => articlesStore.getById(Number(route.params.id)))

const renderedContent = computed(() => {
  if (!article.value) return ''
  let content = article.value.content || ''
  // Simple markdown-like rendering
  content = content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  return content
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px;
}

.article-detail__back {
  margin-bottom: 24px;
}

.article-detail__back a {
  color: #667eea;
  text-decoration: none;
}

.article-detail__content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #eee;
}

.article-detail__title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 16px;
}

.article-detail__meta {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  color: #999;
  font-size: 0.9rem;
}

.article-detail__body {
  line-height: 1.8;
  color: #444;
}

.article-detail__body h1, .article-detail__body h2, .article-detail__body h3 {
  color: #333;
  margin: 24px 0 12px;
}

.tag {
  padding: 2px 10px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #555;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found a {
  color: #667eea;
}
</style>
