<template>
  <div class="dashboard">
    <h1 class="dashboard__title">📊 仪表盘</h1>
    
    <div class="dashboard__stats">
      <div class="stat-card">
        <div class="stat-card__icon">🏢</div>
        <div class="stat-card__number">{{ companiesStore.companies.length }}</div>
        <div class="stat-card__label">收录企业</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">📝</div>
        <div class="stat-card__number">{{ articlesStore.articles.length }}</div>
        <div class="stat-card__label">文章数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">🖼️</div>
        <div class="stat-card__number">{{ bannersStore.banners.length }}</div>
        <div class="stat-card__label">轮播图</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">🏭</div>
        <div class="stat-card__number">{{ companiesStore.industries.length }}</div>
        <div class="stat-card__label">行业分类</div>
      </div>
    </div>

    <!-- 已上线模块 -->
    <div class="dashboard__quick">
      <h2>内容管理</h2>
      <div class="quick-actions">
        <router-link to="/admin/articles" class="quick-btn">📝 文章管理</router-link>
        <router-link to="/admin/companies" class="quick-btn">🏢 企业管理</router-link>
        <router-link to="/admin/banners" class="quick-btn">🖼️ 轮播图管理</router-link>
        <router-link to="/admin/comments" class="quick-btn quick-btn--new">💬 评论管理</router-link>
      </div>
    </div>

    <!-- 开发中模块 -->
    <div class="dashboard__quick">
      <h2>功能模块 <span class="badge">开发中</span></h2>
      <div class="quick-actions">
        <router-link to="/admin/exchange" class="quick-btn quick-btn--dev">💬 交流社区</router-link>
        <router-link to="/admin/messages" class="quick-btn quick-btn--dev">📬 消息中心</router-link>
        <router-link to="/admin/history" class="quick-btn quick-btn--dev">📜 历史归档</router-link>
        <router-link to="/admin/create" class="quick-btn quick-btn--dev">✍️ 创作中心</router-link>
        <router-link to="/admin/feedback" class="quick-btn quick-btn--dev">💡 反馈建议</router-link>
      </div>
    </div>

    <div class="dashboard__recent">
      <h2>最近添加的企业</h2>
      <div class="recent-list">
        <div v-for="company in recentCompanies" :key="company.id" class="recent-item">
          <span class="recent-item__name">{{ company.name }}</span>
          <span class="recent-item__meta">{{ company.city }} · {{ company.schedule }}</span>
          <span class="recent-item__date">{{ company.createdAt }}</span>
        </div>
        <p v-if="recentCompanies.length === 0" class="empty-hint">暂无企业，点击"添加企业"开始</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCompaniesStore } from '../../stores/companies'
import { useArticlesStore } from '../../stores/articles'
import { useBannersStore } from '../../stores/banners'

const companiesStore = useCompaniesStore()
const articlesStore = useArticlesStore()
const bannersStore = useBannersStore()
const recentCompanies = computed(() => companiesStore.companies.slice(0, 5))
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

.dashboard__quick {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #eee;
}

.dashboard__quick h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 8px;
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

.quick-btn--dev {
  opacity: 0.6;
  border: 1px dashed #ccc;
}

.quick-btn--dev:hover {
  opacity: 1;
  background: #999;
}

.quick-btn--new {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.quick-btn--new:hover {
  background: #4caf50;
  color: white;
}

.dashboard__recent {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #eee;
}

.dashboard__recent h2 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 16px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.recent-item__name {
  font-weight: 600;
  color: #333;
}

.recent-item__meta {
  color: #666;
  font-size: 0.9rem;
}

.recent-item__date {
  color: #999;
  font-size: 0.85rem;
}

.empty-hint {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>
