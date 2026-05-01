<template>
  <div class="company-detail" v-if="company">
    <div class="company-detail__header">
      <div class="company-detail__back">
        <router-link to="/companies">← 返回列表</router-link>
      </div>
      <div class="company-detail__info">
        <div class="company-detail__avatar">{{ company.name.charAt(0) }}</div>
        <div>
          <h1 class="company-detail__name">{{ company.name }}</h1>
          <div class="company-detail__tags">
            <span v-for="tag in company.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="company-detail__grid">
      <div class="detail-card">
        <h3>📋 基本信息</h3>
        <div class="detail-row">
          <span class="detail-label">所在城市</span>
          <span class="detail-value">{{ company.province }} · {{ company.city }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">所属行业</span>
          <span class="detail-value">{{ company.industry }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">公司规模</span>
          <span class="detail-value">{{ company.size }} 人</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">工作时间</span>
          <span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">薪资范围</span>
          <span class="detail-value detail-value--highlight">{{ company.salary }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">综合评分</span>
          <span class="detail-value">⭐ {{ company.rating }} / 5.0</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">收录时间</span>
          <span class="detail-value">{{ company.createdAt }}</span>
        </div>
      </div>

      <div class="detail-card">
        <h3>📝 企业简介</h3>
        <p class="company-detail__desc">{{ company.description }}</p>
        <div v-if="company.website" class="detail-row">
          <span class="detail-label">官方网站</span>
          <a :href="company.website" target="_blank" class="detail-value detail-link">{{ company.website }}</a>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>企业不存在</h2>
    <p>该企业可能已被删除</p>
    <router-link to="/companies">返回企业列表</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCompaniesStore } from '../stores/companies'

const route = useRoute()
const companiesStore = useCompaniesStore()
const company = computed(() => companiesStore.getById(Number(route.params.id)))

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
  return 'badge--orange'
}
</script>

<style scoped>
.company-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px;
}

.company-detail__back {
  margin-bottom: 16px;
}

.company-detail__back a {
  color: #2C54FB;
  text-decoration: none;
}

.company-detail__info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.company-detail__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.company-detail__name {
  font-size: 2rem;
  color: #333;
  margin-bottom: 8px;
}

.company-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.company-detail__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .company-detail__grid {
    grid-template-columns: 1fr;
  }
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #eee;
}

.detail-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #2C54FB;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
  font-size: 0.9rem;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.detail-value--highlight {
  color: #2C54FB;
  font-size: 1.1rem;
}

.detail-link {
  color: #2C54FB;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

.company-detail__desc {
  color: #555;
  line-height: 1.8;
  margin-bottom: 16px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--orange { background: #fff3e0; color: #e65100; }

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

.not-found h2 {
  color: #333;
  margin-bottom: 8px;
}

.not-found p {
  color: #666;
  margin-bottom: 16px;
}

.not-found a {
  color: #2C54FB;
}
</style>
