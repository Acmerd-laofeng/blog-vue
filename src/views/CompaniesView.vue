<template>
  <div class="companies">
    <div class="companies__header">
      <h1>🏢 企业收录</h1>
      <p>共收录 {{ companiesStore.companies.length }} 家企业</p>
    </div>

    <div class="companies__filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索企业名称、行业、标签..."
        class="filter-input"
      />
      <select v-model="filters.province" class="filter-select">
        <option value="">全部省份</option>
        <option v-for="p in companiesStore.provinces" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="filters.city" class="filter-select">
        <option value="">全部城市</option>
        <option v-for="c in companiesStore.cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="filters.schedule" class="filter-select">
        <option value="">全部作息</option>
        <option v-for="s in companiesStore.schedules" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="sortBy" class="filter-select">
        <option value="newest">最新收录</option>
        <option value="rating">评分最高</option>
        <option value="name">名称排序</option>
      </select>
    </div>

    <div class="companies__list">
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        class="company-item"
        @click="$router.push(`/company/${company.id}`)"
      >
        <div class="company-item__left">
          <div class="company-item__avatar">{{ company.name.charAt(0) }}</div>
        </div>
        <div class="company-item__middle">
          <h3 class="company-item__name">{{ company.name }}</h3>
          <div class="company-item__meta">
            <span>📍 {{ company.province }}·{{ company.city }}</span>
            <span>🏭 {{ company.industry }}</span>
            <span>👥 {{ company.size }}</span>
          </div>
          <div class="company-item__tags">
            <span v-for="tag in company.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="company-item__right">
          <div class="company-item__salary">{{ company.salary }}</div>
          <span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span>
          <div class="company-item__rating">⭐ {{ company.rating }}</div>
        </div>
      </div>
      <div v-if="filteredCompanies.length === 0" class="empty-state">
        <p>没有找到匹配的企业</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCompaniesStore } from '../stores/companies'

const companiesStore = useCompaniesStore()
const searchQuery = ref('')
const filters = ref({ province: '', city: '', schedule: '' })
const sortBy = ref('newest')

const filteredCompanies = computed(() => {
  let result = companiesStore.search(searchQuery.value, filters.value)
  
  if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }
  
  return result
})

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
  return 'badge--orange'
}
</script>

<style scoped>
.companies {
  max-width: 1464px;
  margin: 0 auto;
  padding: 24px 20px;
}

.companies__header {
  margin-bottom: 24px;
}

.companies__header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 4px;
}

.companies__header p {
  color: #666;
}

.companies__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-input, .filter-select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
}

.filter-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  min-width: 120px;
}

.company-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
}

.company-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.company-item__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.company-item__middle {
  flex: 1;
}

.company-item__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.company-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
}

.company-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.company-item__right {
  text-align: right;
  flex-shrink: 0;
}

.company-item__salary {
  font-size: 1rem;
  font-weight: 600;
  color: #2C54FB;
  margin-bottom: 4px;
}

.company-item__rating {
  font-size: 0.85rem;
  color: #f5a623;
  margin-top: 4px;
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

.tag {
  padding: 2px 10px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #555;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  background: white;
  border-radius: 12px;
}
</style>
