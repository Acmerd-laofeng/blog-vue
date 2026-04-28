<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero__title">Acmerd</h1>
      <p class="hero__subtitle">企业信息收录平台</p>
      <p class="hero__desc">收录企业作息、薪资、城市等信息，帮你找到理想工作</p>
      <div class="hero__actions">
        <router-link to="/companies" class="btn btn--primary">浏览企业</router-link>
        <router-link to="/articles" class="btn btn--secondary">阅读文章</router-link>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">🏢 最新收录企业</h2>
      <div class="company-grid">
        <div
          v-for="company in recentCompanies"
          :key="company.id"
          class="company-card"
          @click="$router.push(`/company/${company.id}`)"
        >
          <div class="company-card__header">
            <h3 class="company-card__name">{{ company.name }}</h3>
            <span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span>
          </div>
          <div class="company-card__info">
            <span>📍 {{ company.province }}·{{ company.city }}</span>
            <span>🏭 {{ company.industry }}</span>
            <span>💰 {{ company.salary }}</span>
          </div>
          <div class="company-card__tags">
            <span v-for="tag in company.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div v-if="recentCompanies.length === 0" class="empty-state">
        <p>暂无企业信息，<router-link to="/login">登录后台</router-link>添加第一条记录</p>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">📊 数据统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__number">{{ companiesStore.companies.length }}</div>
          <div class="stat-card__label">收录企业</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__number">{{ companiesStore.provinces.length }}</div>
          <div class="stat-card__label">覆盖省份</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__number">{{ companiesStore.cities.length }}</div>
          <div class="stat-card__label">覆盖城市</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__number">{{ articlesStore.articles.length }}</div>
          <div class="stat-card__label">文章数量</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCompaniesStore } from '../stores/companies'
import { useArticlesStore } from '../stores/articles'

const companiesStore = useCompaniesStore()
const articlesStore = useArticlesStore()

const recentCompanies = computed(() => companiesStore.companies.slice(0, 6))

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
  return 'badge--orange'
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 40px;
}

.hero__title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.hero__subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.hero__desc {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 32px;
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--primary {
  background: white;
  color: #667eea;
}

.btn--secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
}

.section {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.section__title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.company-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.company-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.company-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.company-card__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--orange { background: #fff3e0; color: #e65100; }

.company-card__info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #666;
}

.company-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 2px 10px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #555;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid #eee;
}

.stat-card__number {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
}

.stat-card__label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  background: white;
  border-radius: 12px;
}

.empty-state a {
  color: #667eea;
  font-weight: 600;
}
</style>
