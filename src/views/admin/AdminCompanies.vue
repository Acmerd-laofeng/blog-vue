<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="page-title">企业管理</h1>
      <div class="header-actions">
        <router-link to="/admin/companies/new" class="btn btn--primary">
          <span class="icon">＋</span> 添加企业
        </router-link>
      </div>
    </div>

    <!-- 工具栏：搜索与排序 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索企业名称、城市..." 
          class="search-input"
        />
      </div>
      
      <div class="sort-box">
        <span class="sort-label">排序：</span>
        <select v-model="sortKey" class="sort-select">
          <option value="id-desc">最新添加</option>
          <option value="id-asc">最早添加</option>
          <option value="rating-desc">评分最高</option>
        </select>
      </div>
    </div>

    <!-- 列表 -->
    <div class="card-list">
      <div v-for="company in filteredAndSortedCompanies" :key="company.id" class="card">
        <div class="card__header">
          <h3 class="card__name">{{ company.name }}</h3>
          <span class="badge" :class="scheduleClass(company.schedule)">
            {{ company.schedule }}
          </span>
        </div>
        
        <div class="card__body">
          <div class="info-row">
            <span class="label">城市</span>
            <span class="value">{{ company.city || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">行业</span>
            <span class="value">{{ company.industry || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">薪资</span>
            <span class="value salary">{{ company.salary || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">评分</span>
            <span class="value rating">⭐ {{ company.rating || 0 }}</span>
          </div>
        </div>

        <div class="card__footer">
          <router-link :to="`/admin/companies/edit/${company.id}`" class="action-link">
            ✏️ 编辑
          </router-link>
          <button @click="handleDelete(company)" class="action-link action-link--danger">
            🗑️ 删除
          </button>
        </div>
      </div>
      
      <div v-if="filteredAndSortedCompanies.length === 0" class="empty-state">
        <span class="empty-icon">🏢</span>
        <p>没有找到相关企业</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCompaniesStore } from '../../stores/companies'

const companiesStore = useCompaniesStore()
const searchQuery = ref('')
const sortKey = ref('id-desc')

// 过滤与排序逻辑
const filteredAndSortedCompanies = computed(() => {
  let result = [...companiesStore.companies]

  // 1. 搜索
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) || 
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.industry && c.industry.toLowerCase().includes(q))
    )
  }

  // 2. 排序
  result.sort((a, b) => {
    if (sortKey.value === 'id-desc') return b.id - a.id
    if (sortKey.value === 'id-asc') return a.id - b.id
    if (sortKey.value === 'rating-desc') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return result
})

async function handleDelete(company) {
  if (confirm(`确定要删除 "${company.name}" 吗？`)) {
    await companiesStore.remove(company.id)
  }
}

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
  return 'badge--orange'
}
</script>

<style scoped>
/* Apple 风格变量 */
:root {
  --apple-bg: #f5f5f7;
  --apple-card: #ffffff;
  --apple-text: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-blue: #0071e3;
  --apple-blue-hover: #0077ed;
  --apple-border: #d2d2d7;
  --apple-radius: 12px;
}

.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 980px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn--primary {
  background: #0071e3;
  color: white;
}

.btn--primary:hover {
  background: #0077ed;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: #e8e8ed;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1d1d1f;
  outline: none;
  transition: background 0.2s;
}

.search-input:focus {
  background: #d2d2d7;
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 0.9rem;
  color: #86868b;
}

.sort-select {
  padding: 8px 12px;
  background: #e8e8ed;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1d1d1f;
  cursor: pointer;
  outline: none;
}

/* 卡片列表 */
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

.card__header {
  padding: 20px 20px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card__name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
  line-height: 1.3;
}

.badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--orange { background: #fff3e0; color: #e65100; }

.card__body {
  padding: 0 20px 16px;
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f5f5f7;
  font-size: 0.9rem;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #86868b;
}

.value {
  color: #1d1d1f;
  font-weight: 500;
}

.value.salary {
  color: #0071e3;
}

.card__footer {
  padding: 16px 20px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f5f5f7;
}

.action-link {
  font-size: 0.85rem;
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.action-link:hover {
  text-decoration: underline;
}

.action-link--danger {
  color: #ff3b30;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #86868b;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>
