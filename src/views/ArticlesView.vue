<template>
  <div class="articles">
    <ErrorBoundary :retry="articlesStore.retryLoad">
      <template #default>
        <div v-if="articlesStore.loading" class="loading-state">加载中...</div>
        <div v-else-if="articlesStore.error" class="error-state">
          <Icon name="error" class="error-icon" />
          <h3>加载失败</h3>
          <p>{{ articlesStore.error }}</p>
          <button @click="articlesStore.retryLoad" class="btn-retry"><Icon name="refresh" class="btn-icon" /> 重新加载</button>
        </div>
        <div v-else>
          <div class="articles__header">
            <h1><Icon name="article" class="header-icon" /> 文章列表</h1>
            <p>共 {{ articlesStore.articles.length }} 篇文章</p>
          </div>

          <!-- 标签筛选栏 -->
          <div class="tags-filter">
            <button 
              class="tag-btn" 
              :class="{ active: !selectedTag }" 
              @click="selectedTag = null"
            >
              全部
            </button>
            <button 
              v-for="tag in tags" 
              :key="tag.id"
              class="tag-btn" 
              :class="{ active: selectedTag && selectedTag.id === tag.id }"
              @click="selectTag(tag)"
            >
              <span class="tag-dot" :style="{ background: tag.color }"></span>
              {{ tag.name }}
            </button>
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
                  <Icon name="article" />
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
            <Icon name="inbox" class="empty-icon" />
            <p>暂无文章，<router-link to="/login">登录后台</router-link>发布第一篇</p>
          </div>
          
          <!-- 无限滚动哨兵元素 -->
          <div ref="sentinel" class="load-more-trigger">
            <div v-if="articlesStore.loading" class="loading-spinner">
              <Icon name="refresh" class="spinner-icon" /> 加载中...
            </div>
            <div v-else-if="!articlesStore.hasMore" class="end-message">
              已经到底啦 ~
            </div>
          </div>
        </div>
      </template>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useArticlesStore } from '../stores/articles'
import { tagService } from '../services/tagService'
import Icon from '../components/Icons.vue'

const articlesStore = useArticlesStore()
const tags = ref([])
const selectedTag = ref(null)
const sentinel = ref(null)
let observer = null

onMounted(async () => {
  // 加载标签
  tags.value = await tagService.getAll()

  // 创建 IntersectionObserver 监听滚动到底部
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && articlesStore.hasMore && !articlesStore.loading) {
      if (selectedTag.value) {
        // TODO: 按标签加载更多
      } else {
        articlesStore.loadMore()
      }
    }
  }, { rootMargin: '100px' })

  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

async function selectTag(tag) {
  selectedTag.value = tag
  // 重新加载文章
  articlesStore.articles = []
  articlesStore.page = 1
  // TODO: 调用按标签筛选的接口
  await articlesStore.load()
}
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.articles__header p {
  color: #666;
}

/* 标签筛选栏 */
.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.tag-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: #2C54FB;
  color: #2C54FB;
}

.tag-btn.active {
  background: #2C54FB;
  border-color: #2C54FB;
  color: white;
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
  width: 3rem;
  height: 3rem;
  margin-bottom: 16px;
  color: var(--error);
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

/* 无限滚动加载状态 */
.load-more-trigger {
  text-align: center;
  padding: 30px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 4px;
  animation: spin 1s linear infinite;
}

.spinner-icon {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #ccc;
  margin-bottom: 8px;
}
.article-card:has(.article-card__placeholder) .article-card__image {
  aspect-ratio: auto;
  height: 120px;
}
</style>
