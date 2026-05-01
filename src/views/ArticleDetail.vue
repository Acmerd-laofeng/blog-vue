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
        <span class="views-count">👀 {{ article.view_count || 0 }} 次阅读</span>
      </div>
      <div class="article-detail__body" v-html="article.content"></div>
    </article>
    
    <!-- 评论区 -->
    <ArticleComments v-if="article.id" :article-id="article.id" />
  </div>
  <div v-else class="not-found">
    <h2>文章不存在</h2>
    <router-link to="/articles">返回文章列表</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '../stores/articles'
import { articleService } from '../services/articleService'
import ArticleComments from '../components/ArticleComments.vue'

const route = useRoute()
const articlesStore = useArticlesStore()
const article = computed(() => articlesStore.getById(Number(route.params.id)))

// 打开文章时自动增加浏览数
onMounted(() => {
  if (article.value?.id) {
    articleService.incrementViews(article.value.id)
    // 前端乐观更新，让数字立刻 +1
    article.value.view_count = (article.value.view_count || 0) + 1
  }
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
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  color: #999;
  font-size: 0.9rem;
}

.views-count {
  margin-left: auto;
  color: #667eea;
  font-weight: 600;
}

.article-detail__body {
  line-height: 1.8;
  color: #444;
}

.article-detail__body :deep(h1),
.article-detail__body :deep(h2),
.article-detail__body :deep(h3) {
  color: #333;
  margin: 24px 0 12px;
}

.article-detail__body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
}

.article-detail__body :deep(blockquote) {
  border-left: 3px solid #667eea;
  padding-left: 1em;
  margin: 1em 0;
  color: #666;
}

.article-detail__body :deep(pre) {
  background: #1a1a2e;
  color: #eee;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.article-detail__body :deep(code) {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.article-detail__body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-detail__body :deep(ul),
.article-detail__body :deep(ol) {
  padding-left: 1.5em;
  margin: 1em 0;
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
