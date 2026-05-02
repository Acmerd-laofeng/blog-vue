<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">数据概览</h1>
    </div>
    
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
        <div class="stat-card__number">{{ hotArticles ? hotArticles.length : 0 }}</div>
        <div class="stat-card__label">热门文章</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="dashboard__chart-section">
      <h2 class="section-title">🏆 热门文章 Top 5</h2>
      <div ref="chartRef" class="chart-container"></div>
    </div>

    <!-- 快捷操作 -->
    <div class="dashboard__quick">
      <h2 class="section-title">快捷操作</h2>
      <div class="quick-actions">
        <router-link to="/admin/articles" class="quick-btn">📝 文章管理</router-link>
        <router-link to="/admin/companies" class="quick-btn">🏢 企业管理</router-link>
        <router-link to="/admin/comments" class="quick-btn">💬 评论管理</router-link>
        <router-link to="/admin/users" class="quick-btn">👥 用户管理</router-link>
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
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('id, title, view_count')
  
  if (articlesError) {
    console.error('Failed to load articles:', articlesError)
  }
  
  if (articles && articles.length > 0) {
    stats.value.articles = articles.length
    stats.value.views = articles.reduce((sum, a) => sum + (a.view_count || 0), 0)
    // 顺便存一份热门文章数据用于图表
    hotArticles.value = articles
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5)
  }

  // 2. 评论数
  try {
    const allComments = await commentService.getAll()
    stats.value.comments = allComments ? allComments.length : 0
  } catch (e) {
    console.error('Failed to load comments:', e)
    stats.value.comments = 0
  }

  // 渲染图表
  renderChart()
}

// 渲染 ECharts
function renderChart() {
  if (!chartRef.value || !hotArticles.value || hotArticles.value.length === 0) return

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
      itemStyle: { color: '#0071e3' }, // Apple Blue
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
/* Apple 风格变量 */
:root {
  --apple-bg: #f5f5f7;
  --apple-card: #ffffff;
  --apple-text: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-blue: #0071e3;
  --apple-radius: 16px;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card__icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.stat-card__number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.stat-card__label {
  color: #86868b;
  font-size: 0.9rem;
  font-weight: 500;
}

.dashboard__chart-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.dashboard__quick {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.quick-btn {
  display: block;
  padding: 16px;
  background: #f5f5f7;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 500;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #0071e3;
  color: white;
}
</style>
