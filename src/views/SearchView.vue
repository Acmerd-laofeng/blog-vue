<template>
  <div class="search-page">
    <div class="search-page__header">
      <h1>🔍 搜索结果</h1>
      <p v-if="query">搜索关键词：「{{ query }}」</p>
      <p v-else>请输入关键词搜索</p>
    </div>

    <div v-if="loading" class="search-page__loading">
      <p>搜索中...</p>
    </div>

    <div v-else-if="results.length === 0" class="search-page__empty">
      <p>未找到相关内容</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>

    <div v-else class="search-results">
      <div 
        v-for="article in results" 
        :key="article.id"
        class="result-card"
        @click="$router.push(`/article/${article.id}`)"
      >
        <img v-if="article.cover_url" :src="article.cover_url" :alt="article.title" />
        <div class="result-info">
          <h3>{{ article.title }}</h3>
          <p>{{ article.summary }}</p>
          <span class="result-date">{{ article.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleService } from '../services/articleService'

const route = useRoute()
const query = ref('')
const results = ref([])
const loading = ref(false)

async function doSearch(q) {
  if (!q) {
    results.value = []
    return
  }
  loading.value = true
  query.value = q
  try {
    results.value = await articleService.search(q)
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

.search-page__loading,
.search-page__empty {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  color: #999;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #667eea;
  text-decoration: none;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.result-card img {
  width: 200px;
  height: 140px;
  object-fit: cover;
  flex-shrink: 0;
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

.result-date {
  color: #999;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .result-card {
    flex-direction: column;
  }
  
  .result-card img {
    width: 100%;
    height: 160px;
  }
}
</style>
