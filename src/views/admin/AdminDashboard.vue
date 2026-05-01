<template>
  <div class="dashboard">
    <h1 class="dashboard__title">📊 数据概览</h1>
    
    <!-- 核心指标卡片 -->
    <div class="dashboard__stats">
      <div class="stat-card">
        <div class="stat-card__icon">📝</div>
        <div class="stat-card__number">{{ stats.articles }}</div>
        <div class="stat-card__label">文章总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">👀</div>
        <div class="stat-card__number">{{ stats.views }}</div>
        <div class="stat-card__label">总浏览量</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">💬</div>
        <div class="stat-card__number">{{ stats.comments }}</div>
        <div class="stat-card__label">评论总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">🔥</div>
        <div class="stat-card__number">{{ hotArticles.length }}</div>
        <div class="stat-card__label">热门文章</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="dashboard__chart-section">
      <h2 class="chart-title">🏆 热门文章 Top 5</h2>
      <div ref="chartRef" class="chart-container"></div>
    </div>

    <!-- 快捷操作 -->
    <div class="dashboard__quick">
      <h2>快捷操作</h2>
      <div class="quick-actions">
        <router-link to="/admin/articles" class="quick-btn">📝 文章管理</router-link>
        <router-link to="/admin/companies" class="quick-btn">🏢 企业管理</router-link>
        <router-link to="/admin/comments" class="quick-btn quick-btn--new">💬 评论管理</router-link>
        <router-link to="/admin/users" class="quick-btn quick-btn--new">👥 用户管理</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompaniesStore } from '../../stores/companies'
import { useArticlesStore } from '../../stores/articles'
import { commentService } from '../../services/commentService'
import { articleService } from '../../services/articleService'
import { supabase } from '../../lib/supabase'
import * as echarts from 'echarts'

const companiesStore = useCompaniesStore()
const articlesStore = useArticlesStore()

const stats = ref({
  articles: 0,
  views: 0,
  comments: 0
})

const hotArticles = ref([])
const chartRef = ref(null)

// 加载统计数据
async function loadStats() {
  // 1. 文章数和总浏览量
  const { data: articles } = await supabase
    .from('articles')
    .select('view_count')
  
  if (articles) {
    stats.value.articles = articles.length
    stats.value.views = articles.reduce((sum, a) => sum + (a.view_count || 0), 0)
    // 顺便存一份热门文章数据用于图表
    hotArticles.value = articles
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5)
  }

  // 2. 评论数
  const { data: comments } = await supabase
    .from('article_comments')
    .select('id', { count: 'exact', head: true })
  
  if (comments) {
    // Supabase v2 count behavior
  }
  // 如果 count 不好用，直接用本地缓存大概数量或全量拉取
  // 为了演示，我们简单处理，实际项目最好用 RPC 计数
  const allComments = await commentService.getAll()
  stats.value.comments = allComments.length

  // 渲染图表
  renderChart()
}

// 渲染 ECharts
function renderChart() {
  if (!chartRef.value || hotArticles.value.length === 0) return

  const chart = echarts.init(chartRef.value)
  
  const titles = hotArticles.value.map(a => a.title.length > 10 ? a.title.substring(0, 10) + '...' : a.title)
  const views = hotArticles.value.map(a => a.view_count || 0)

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: titles, axisLabel: { interval: 0, rotate: 30 } },
    yAxis: { type: 'value' },
    series: [{
      data: views,
      type: 'bar',
      itemStyle: { color: '#667eea' },
      label: { show: true, position: 'top' }
    }]
  }

  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 32px;
}

.dashboard__title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 32px;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid #eee;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card__icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.stat-card__number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
}

.stat-card__label {
  color: #666;
  font-size: 0.9rem;
  margin-top: 4px;
}

.dashboard__chart-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #eee;
  margin-bottom: 32px;
}

.chart-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.dashboard__quick {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #eee;
}

.dashboard__quick h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 16px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.quick-btn {
  display: block;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
}

.quick-btn--new {
  border: 1px dashed #667eea;
  background: white;
}

.quick-btn--new:hover {
  background: #667eea;
  color: white;
}
</style>
