<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">数据概览</h1>
      <p class="page-subtitle">实时运营数据看板</p>
    </div>
    
    <!-- 核心指标卡片 -->
    <div class="dashboard__stats">
      <div class="stat-card">
        <div class="stat-card__header">
          <Icon name="article" class="stat-icon" />
          <span class="stat-card__label">文章总数</span>
        </div>
        <div class="stat-card__number">{{ stats.articles }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__header">
          <Icon name="eye" class="stat-icon" />
          <span class="stat-card__label">总浏览量</span>
        </div>
        <div class="stat-card__number">{{ stats.views }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__header">
          <Icon name="comment" class="stat-icon" />
          <span class="stat-card__label">评论总数</span>
        </div>
        <div class="stat-card__number">{{ stats.comments }}</div>
      </div>
      <div class="stat-card stat-card--highlight">
        <div class="stat-card__header">
          <Icon name="user" class="stat-icon stat-icon--green" />
          <span class="stat-card__label">今日新增用户</span>
        </div>
        <div class="stat-card__number stat-card__number--green">{{ stats.todayUsers }}</div>
      </div>
      <div class="stat-card stat-card--highlight">
        <div class="stat-card__header">
          <Icon name="comment" class="stat-icon stat-icon--blue" />
          <span class="stat-card__label">今日新增评论</span>
        </div>
        <div class="stat-card__number stat-card__number--blue">{{ stats.todayComments }}</div>
      </div>
    </div>

    <!-- 图表区域：热门文章 + 搜索热词 -->
    <div class="dashboard__charts">
      <div class="chart-panel">
        <h2 class="panel-title"><Icon name="eye" class="panel-icon" /> 文章阅读量排行 Top 5</h2>
        <div ref="viewsChartRef" class="chart-container"></div>
      </div>
      <div class="chart-panel">
        <h2 class="panel-title"><Icon name="search" class="panel-icon" /> 搜索热词 Top 10</h2>
        <div v-if="hotSearches.length > 0" class="hot-searches">
          <div v-for="(item, index) in hotSearches" :key="item.query" class="hot-search-item">
            <span class="hot-search-rank" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
            <span class="hot-search-query">{{ item.query }}</span>
            <span class="hot-search-count">{{ item.search_count }} 次</span>
          </div>
        </div>
        <div v-else class="empty-chart">
          <Icon name="search-empty" class="empty-icon" />
          <p>暂无搜索数据</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="dashboard__quick">
      <h2 class="section-title">快捷操作</h2>
      <div class="quick-actions">
        <router-link to="/admin/articles" class="quick-btn">
          <Icon name="article" class="quick-icon" /> 文章管理
        </router-link>
        <router-link to="/admin/companies" class="quick-btn">
          <Icon name="building" class="quick-icon" /> 企业管理
        </router-link>
        <router-link to="/admin/comments" class="quick-btn">
          <Icon name="comment" class="quick-icon" /> 评论管理
        </router-link>
        <router-link to="/admin/users" class="quick-btn">
          <Icon name="user" class="quick-icon" /> 用户管理
        </router-link>
        <router-link to="/admin/works" class="quick-btn">
          <Icon name="image" class="quick-icon" /> 作品管理
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompaniesStore } from '../../stores/companies'
import { useArticlesStore } from '../../stores/articles'
import { commentService } from '../../services/commentService'
import { searchStatsService } from '../../services/searchStatsService'
import { supabase } from '../../lib/supabase'
import * as echarts from 'echarts'
import Icon from '../../components/Icons.vue'

const companiesStore = useCompaniesStore()
const articlesStore = useArticlesStore()

const stats = ref({
  articles: 0,
  views: 0,
  comments: 0,
  todayUsers: 0,
  todayComments: 0
})

const hotArticles = ref([])
const hotSearches = ref([])
const viewsChartRef = ref(null)

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
    // 热门文章数据
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

  // 3. 今日新增用户（从今天 00:00 开始）
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const { count: todayUsersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString())
  
  stats.value.todayUsers = todayUsersCount || 0

  // 4. 今日新增评论
  const { count: todayCommentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString())
  
  stats.value.todayComments = todayCommentsCount || 0

  // 5. 搜索热词 Top 10
  hotSearches.value = await searchStatsService.getTopSearches(10)

  // 渲染图表
  renderViewsChart()
}

// 渲染阅读量排行图表
function renderViewsChart() {
  if (!viewsChartRef.value || !hotArticles.value || hotArticles.value.length === 0) return

  const chart = echarts.init(viewsChartRef.value)
  
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
      itemStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#2C54FB' },
            { offset: 1, color: '#5B8DEF' }
          ]
        }
      },
      label: { show: true, position: 'top' },
      barWidth: '50%'
    }]
  }

  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
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

.page-subtitle {
  color: #86868b;
  margin: 4px 0 0;
  font-size: 0.95rem;
}

/* 核心指标卡片 */
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card--highlight {
  border: 2px solid #e8f5e9;
}

.stat-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #0071e3;
}

.stat-icon--green {
  color: #34c759;
}

.stat-icon--blue {
  color: #5ac8fa;
}

.stat-card__number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.stat-card__number--green {
  color: #34c759;
}

.stat-card__number--blue {
  color: #5ac8fa;
}

.stat-card__label {
  color: #86868b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 图表区域 */
.dashboard__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.chart-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #0071e3;
}

.chart-container {
  width: 100%;
  height: 280px;
}

/* 搜索热词列表 */
.hot-searches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hot-search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f5f7;
  border-radius: 8px;
  transition: background 0.2s;
}

.hot-search-item:hover {
  background: #e8e8ed;
}

.hot-search-rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e8e8ed;
  color: #86868b;
  font-size: 0.8rem;
  font-weight: 600;
}

.hot-search-rank.top-3 {
  background: #0071e3;
  color: white;
}

.hot-search-query {
  flex: 1;
  font-size: 0.95rem;
  color: #1d1d1f;
}

.hot-search-count {
  font-size: 0.85rem;
  color: #86868b;
}

.empty-chart {
  text-align: center;
  padding: 40px 20px;
  color: #86868b;
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #ccc;
  margin-bottom: 8px;
}

/* 快捷操作 */
.dashboard__quick {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.quick-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
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

.quick-icon {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .dashboard__charts {
    grid-template-columns: 1fr;
  }
  
  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
