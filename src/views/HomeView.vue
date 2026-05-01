<template>
  <div class="home">
    <!-- Banner 轮播图 (加载中占位) -->
    <section class="banner-section">
      <div v-if="bannersStore.loading" class="banner-loading">
        <div class="spinner"></div>
      </div>
      <div v-else-if="activeBanners.length > 0" class="banner-slider">
        <div 
          v-for="(banner, index) in activeBanners" 
          :key="banner.id"
          class="banner-slide"
          :class="{ active: currentSlide === index }"
        >
          <a v-if="banner.link_url" :href="banner.link_url" target="_blank" class="banner-link">
            <img :src="banner.image_url" :alt="banner.title" class="banner-image" />
          </a>
          <img v-else :src="banner.image_url" :alt="banner.title" class="banner-image" />
          <div class="banner-caption" v-if="banner.title">
            <h3>{{ banner.title }}</h3>
          </div>
        </div>
        
        <button v-if="activeBanners.length > 1" @click="prevSlide" class="banner-nav banner-nav--prev">‹</button>
        <button v-if="activeBanners.length > 1" @click="nextSlide" class="banner-nav banner-nav--next">›</button>
        
        <div class="banner-indicators" v-if="activeBanners.length > 1">
          <button 
            v-for="(banner, index) in activeBanners" 
            :key="index"
            @click="currentSlide = index"
            class="banner-indicator"
            :class="{ active: currentSlide === index }"
          ></button>
        </div>
      </div>
      <div v-else class="banner-empty">
        <p> 暂无轮播图，请在后台添加</p>
      </div>
    </section>

    <!-- 文章区域 -->
    <section class="articles-section">
      <div v-if="articlesStore.loading" class="loading-grid">
        <div class="skeleton skeleton-lg"></div>
        <div class="skeleton-grid">
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
          <div class="skeleton"></div>
        </div>
      </div>

      <div v-else-if="articlesStore.articles.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>还没有文章</h3>
        <p>快去后台发布你的第一篇文章吧！</p>
        <router-link to="/admin/articles/new" class="btn">去发布文章</router-link>
      </div>

      <div v-else class="articles-grid">
        <!-- 左侧：最新文章 -->
        <div class="latest-article">
          <div v-if="latestArticle" class="latest-article-card" @click="$router.push(`/article/${latestArticle.id}`)">
            <img v-if="latestArticle.cover_url" :src="latestArticle.cover_url" :alt="latestArticle.title" />
            <div v-else class="article-placeholder">📝</div>
            <div class="article-info">
              <h3>{{ latestArticle.title }}</h3>
              <p>{{ latestArticle.summary }}</p>
              <span class="article-date">{{ latestArticle.date }}</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧：往期文章 2x2 -->
        <div class="past-articles">
          <div 
            v-for="article in pastArticles" 
            :key="article.id"
            class="past-article-card"
            @click="$router.push(`/article/${article.id}`)"
          >
            <img v-if="article.cover_url" :src="article.cover_url" :alt="article.title" />
            <div v-else class="article-placeholder-sm">📝</div>
            <div class="article-info-sm">
              <h4>{{ article.title }}</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 其他内容区域 -->
    <section class="other-content">
      <h2 class="section-label">其他内容</h2>
      <div class="other-grid">
        <router-link to="/companies" class="other-card">
          <span class="other-icon">🏢</span>
          <h3>企业筛选</h3>
          <p>收录企业作息、薪资等信息</p>
        </router-link>
        <router-link to="/exchange" class="other-card">
          <span class="other-icon">💬</span>
          <h3>交流社区</h3>
          <p>话题讨论与经验分享</p>
        </router-link>
        <router-link to="/create" class="other-card">
          <span class="other-icon">✍️</span>
          <h3>创作中心</h3>
          <p>发布你的原创内容</p>
        </router-link>
        <router-link to="/history" class="other-card">
          <span class="other-icon">📜</span>
          <h3>历史归档</h3>
          <p>过往内容回顾</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useArticlesStore } from '../stores/articles'
import { useBannersStore } from '../stores/banners'

const articlesStore = useArticlesStore()
const bannersStore = useBannersStore()

const activeBanners = computed(() => bannersStore.banners.filter(b => b.is_active))
const currentSlide = ref(0)
let slideInterval = null

const latestArticle = computed(() => articlesStore.articles[0] || null)
const pastArticles = computed(() => articlesStore.articles.slice(1, 5))

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % activeBanners.value.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + activeBanners.value.length) % activeBanners.value.length
}

onMounted(() => {
  if (activeBanners.value.length > 1) {
    slideInterval = setInterval(nextSlide, 5000)
  }
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
.home {
  padding: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #2C54FB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 16px;
}

/* Banner States */
.banner-section {
  width: 100%;
  margin-bottom: 24px;
}

.banner-loading,
.banner-empty {
  max-width: 1464px;
  margin: 0 auto;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 12px;
  color: #999;
}

.banner-slider {
  position: relative;
  width: 100%;
  max-width: 1464px;
  margin: 0 auto;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.banner-slide.active {
  opacity: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-link {
  display: block;
}

.banner-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}

.banner-caption h3 {
  font-size: 1.5rem;
  margin: 0;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.banner-nav:hover {
  background: rgba(0,0,0,0.8);
}

.banner-nav--prev { left: 16px; }
.banner-nav--next { right: 16px; }

.banner-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.banner-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
}

.banner-indicator.active {
  background: white;
}

/* Articles Section */
.articles-section {
  max-width: 1464px;
  margin: 0 auto 40px;
}

.section-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

/* Loading Skeleton */
.loading-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.skeleton {
  background: #eee;
  border-radius: 12px;
  height: 320px;
  animation: pulse 1.5s infinite;
}

.skeleton-lg {
  height: 320px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.skeleton-grid .skeleton {
  height: 150px;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  border: 1px dashed #ddd;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Latest Article */
.latest-article {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.latest-article:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.latest-article-card {
  display: flex;
  height: 320px;
}

.latest-article-card img {
  width: 50%;
  height: 100%;
  object-fit: cover;
}

.article-placeholder {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: #f5f5f5;
}

.article-info {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-info h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
}

.article-info p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  color: #999;
  font-size: 0.85rem;
}

/* Past Articles */
.past-articles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.past-article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.past-article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.past-article-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.article-placeholder-sm {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: #f5f5f5;
}

.article-info-sm {
  padding: 12px;
}

.article-info-sm h4 {
  font-size: 0.95rem;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Other Content */
.other-content {
  max-width: 1464px;
  margin: 0 auto 60px;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.other-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s, box-shadow 0.2s;
}

.other-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.other-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.other-card h3 {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #333;
}

.other-card p {
  font-size: 0.85rem;
  color: #999;
}

/* Responsive */
@media (max-width: 900px) {
  .articles-grid, .loading-grid {
    grid-template-columns: 1fr;
  }
  
  .other-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .skeleton-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .banner-slider, .banner-loading, .banner-empty {
    height: 180px;
  }
  
  .latest-article-card {
    flex-direction: column;
    height: auto;
  }
  
  .latest-article-card img,
  .article-placeholder {
    width: 100%;
    height: 180px;
  }
  
  .other-grid {
    grid-template-columns: 1fr;
  }
  
  .past-articles {
    grid-template-columns: 1fr;
  }
  
  .section-label {
    font-size: 1.1rem;
  }
}
</style>
