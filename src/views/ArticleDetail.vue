<template>
  <ErrorBoundary :retry="loadArticle">
    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="{ width: scrollProgress + '%' }"></div>
    
    <div class="article-detail" v-if="article">
      <div class="article-detail__back">
        <router-link to="/articles">← 返回文章列表</router-link>
      </div>
      <article class="article-detail__content">
        <h1 class="article-detail__title">{{ article.title }}</h1>
        
        <!-- 互动按钮组 (登录后可见) -->
        <div class="interaction-bar" v-if="authStore.user">
          <button class="interact-btn" :class="{ active: isLiked }" @click="toggleLike">
            <span class="icon">{{ isLiked ? '❤️' : '🤍' }}</span> 点赞
          </button>
          <button class="interact-btn" :class="{ active: isFavorited }" @click="toggleFavorite">
            <span class="icon">{{ isFavorited ? '⭐' : '☆' }}</span> 收藏
          </button>
        </div>

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
      <div class="error-icon">🔍</div>
      <h2>文章不存在或加载失败</h2>
      <p v-if="loadError" class="error-msg">{{ loadError }}</p>
      <div class="actions">
        <router-link to="/articles" class="btn">返回文章列表</router-link>
        <button @click="loadArticle" class="btn btn-retry">🔄 重新加载</button>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '../stores/articles'
import { useAuthStore } from '../stores/auth'
import { articleService } from '../services/articleService'
import { interactionService } from '../services/interactionService'
import ArticleComments from '../components/ArticleComments.vue'

const route = useRoute()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

const article = ref(null)
const loadError = ref(null)
const scrollProgress = ref(0)

// 加载文章
async function loadArticle() {
  loadError.value = null
  try {
    const data = await articleService.getById(Number(route.params.id))
    if (data) {
      article.value = data
    } else {
      loadError.value = '未找到该文章'
    }
  } catch (e) {
    loadError.value = e.message || '加载失败，请检查网络'
    console.error('Load article error:', e)
  }
}

const isLiked = ref(false)
const isFavorited = ref(false)

// 检查互动状态
async function checkStatus() {
  if (!authStore.user || !article.value) return
  try {
    isLiked.value = await interactionService.checkLike('article', article.value.id, authStore.user.id)
    isFavorited.value = await interactionService.checkFavorite('article', article.value.id, authStore.user.id)
  } catch (e) { console.error(e) }
}

// 切换点赞
async function toggleLike() {
  try {
    isLiked.value = await interactionService.toggleLike('article', article.value.id, authStore.user.id, isLiked.value)
  } catch (e) { alert(e.message) }
}

// 切换收藏
async function toggleFavorite() {
  try {
    isFavorited.value = await interactionService.toggleFavorite('article', article.value.id, authStore.user.id, isFavorited.value)
  } catch (e) { alert(e.message) }
}

// 打开文章时自动增加浏览数
onMounted(async () => {
  await loadArticle()
  if (article.value?.id) {
    articleService.incrementViews(article.value.id)
    // 前端乐观更新
    article.value.view_count = (article.value.view_count || 0) + 1
    // 检查点赞状态
    await checkStatus()
    // 动态 SEO 标题
    updateSEO()
    // 绑定滚动事件
    window.addEventListener('scroll', updateScrollProgress)
    window.addEventListener('resize', updateScrollProgress)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})

// 滚动进度
function updateScrollProgress() {
  const articleEl = document.querySelector('.article-detail__body')
  if (!articleEl) return
  
  const rect = articleEl.getBoundingClientRect()
  const articleHeight = articleEl.offsetHeight
  const viewportHeight = window.innerHeight
  
  // 文章顶部进入视口开始计算
  const scrolled = viewportHeight - rect.top
  const total = articleHeight
  
  if (scrolled <= 0) {
    scrollProgress.value = 0
  } else if (scrolled >= total) {
    scrollProgress.value = 100
  } else {
    scrollProgress.value = Math.round((scrolled / total) * 100)
  }
}

// 动态更新 SEO 元数据
function updateSEO() {
  if (!article.value) return
  
  const title = `${article.value.title} - Acmerd`
  const desc = article.value.content?.substring(0, 150).replace(/<[^>]+>/g, '') || '阅读精彩内容'
  
  document.title = title
  
  let metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.setAttribute('content', desc)
  
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', title)
  
  let ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', desc)
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 20px;
  position: relative;
}

/* 阅读进度条 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #2C54FB, #5B8DEF, #2C54FB);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(44, 84, 251, 0.4);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.article-detail__back {
  margin-bottom: 24px;
}

.article-detail__back a {
  color: #2C54FB;
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
  margin: 0 0 8px 0;
}

.interaction-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.interact-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.interact-btn:hover {
  background: #f5f5f7;
}

.interact-btn.active {
  color: #2C54FB;
  border-color: #2C54FB;
  background: rgba(44, 84, 251, 0.05);
}

.interact-btn .icon {
  font-size: 1rem;
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
  color: #2C54FB;
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
  border-left: 3px solid #2C54FB;
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

.not-found .error-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.not-found h2 {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.error-msg {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-retry {
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
}

.btn-retry:hover {
  background: var(--accent-hover);
}

.not-found a {
  color: #2C54FB;
}
</style>
