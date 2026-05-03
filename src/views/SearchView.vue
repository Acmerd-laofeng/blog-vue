<template>
  <div class="search-page">
    <div class="search-page__header">
      <h1>🔍 搜索结果</h1>
      <p v-if="query">搜索关键词：「{{ query }}」</p>
      <p v-else>请输入关键词搜索</p>
      <p v-if="total > 0" class="result-count">找到 {{ total }} 条结果</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="search-page__loading">
      <div class="spinner"></div>
      <p>搜索中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="total === 0 && searched" class="search-page__empty">
      <span class="empty-icon">🔍</span>
      <p>未找到相关内容</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="search-results">
      <!-- 文章结果 -->
      <section v-if="articles.length > 0" class="result-section">
        <h2 class="section-title">📝 文章 ({{ articles.length }})</h2>
        <div class="result-list">
          <div 
            v-for="article in articles" 
            :key="article.id"
            class="result-card"
            @click="$router.push(`/article/${article.id}`)"
          >
            <div class="result-cover">
              <img v-if="article.cover_url" :src="article.cover_url" :alt="article.title" />
              <div v-else class="result-placeholder">📝</div>
            </div>
            <div class="result-info">
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <span class="result-date">{{ article.date }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 企业结果 -->
      <section v-if="companies.length > 0" class="result-section">
        <h2 class="section-title">🏢 企业 ({{ companies.length }})</h2>
        <div class="result-list">
          <div 
            v-for="company in companies" 
            :key="company.id"
            class="result-card result-card--company"
            @click="$router.push(`/company/${company.id}`)"
          >
            <div class="result-info">
              <h3>{{ company.name }}</h3>
              <p>{{ company.description || company.industry }}</p>
              <span class="result-location">{{ company.province }} · {{ company.city }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 作品结果 -->
      <section v-if="works.length > 0" class="result-section">
        <h2 class="section-title">🎨 作品 ({{ works.length }})</h2>
        <div class="result-grid">
          <div 
            v-for="work in works" 
            :key="work.id"
            class="result-work-card"
            @click="$router.push(`/works`)"
          >
            <img :src="work.image_url" :alt="work.title" />
            <div class="result-work-info">
              <h4>{{ work.title }}</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchService } from '../services/searchService'
import { searchStatsService } from '../services/searchStatsService'

const route = useRoute()
const query = ref('')
const articles = ref([])
const companies = ref([])
const works = ref([])
const loading = ref(false)
const searched = ref(false)

const total = ref(0)

async function doSearch(q) {
  if (!q) {
    articles.value = []
    companies.value = []
    works.value = []
    total.value = 0
    searched.value = false
    return
  }
  
  loading.value = true
  query.value = q
  searched.value = true
  
  try {
    const results = await searchService.searchAll(q)
    articles.value = results.articles
    companies.value = results.companies
    works.value = results.works
    total.value = results.total
    
    // 记录搜索行为
    await searchStatsService.trackSearch(q, total.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  doSearch(route.query.q)
})

watch(() => route.query.q, (newQ) => {
  doSearch(newQ)
})
</script>

<style scoped>
.search-page {
  max-width: 1464px;
  margin: 0 auto;
  padding: 24px 20px;
}

.search-page__header {
  margin-bottom: 24px;
}

.search-page__header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 4px;
}

.search-page__header p {
  color: #666;
}

.result-count {
  margin-top: 8px;
  color: #2C54FB;
  font-weight: 500;
}

.search-page__loading,
.search-page__empty {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #2C54FB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #2C54FB;
  text-decoration: none;
}

/* 结果分区 */
.result-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* 结果卡片 */
.result-card {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.result-card--company {
  padding: 16px;
}

.result-cover {
  width: 200px;
  height: 140px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-placeholder {
  font-size: 2.5rem;
}

.result-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-info h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 8px;
}

.result-info p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-date,
.result-location {
  color: #999;
  font-size: 0.85rem;
}

/* 作品卡片 */
.result-work-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
}

.result-work-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.result-work-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.result-work-info {
  padding: 12px;
}

.result-work-info h4 {
  font-size: 0.95rem;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .result-card {
    flex-direction: column;
  }
  
  .result-cover {
    width: 100%;
    height: 160px;
  }
  
  .result-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
