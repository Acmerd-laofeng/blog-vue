<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <h1>🏢 企业管理</h1>
      <router-link to="/admin/companies/new" class="btn btn--primary">➕ 添加企业</router-link>
    </div>

    <div v-if="companiesStore.loading" class="loading">加载中...</div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>企业名称</th>
            <th>城市</th>
            <th>行业</th>
            <th>作息</th>
            <th>薪资</th>
            <th>评分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companiesStore.companies" :key="company.id">
            <td>{{ company.id }}</td>
            <td><strong>{{ company.name }}</strong></td>
            <td>{{ company.city }}</td>
            <td>{{ company.industry }}</td>
            <td><span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span></td>
            <td>{{ company.salary }}</td>
            <td>⭐ {{ company.rating }}</td>
            <td class="actions">
              <router-link :to="`/admin/companies/edit/${company.id}`" class="btn-sm btn--edit">编辑</router-link>
              <button @click="handleDelete(company)" class="btn-sm btn--delete" :disabled="deletingId === company.id">
                {{ deletingId === company.id ? '删除中...' : '删除' }}
              </button>
            </td>
          </tr>
          <tr v-if="!companiesStore.loading && companiesStore.companies.length === 0">
            <td colspan="8" class="empty-row">暂无企业数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCompaniesStore } from '../../stores/companies'

const companiesStore = useCompaniesStore()
const deletingId = ref(null)

async function handleDelete(company) {
  if (confirm(`确定要删除"${company.name}"吗？`)) {
    deletingId.value = company.id
    try {
      await companiesStore.remove(company.id)
    } finally {
      deletingId.value = null
    }
  }
}

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
  return 'badge--orange'
}
</script>

<style scoped>
.admin-page {
  padding: 32px;
}

.admin-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-page__header h1 {
  font-size: 1.5rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #eee;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #f5f7fa;
  padding: 14px 16px;
  text-align: left;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  border-bottom: 2px solid #eee;
}

.table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #333;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background: #f9f9fb;
}

.badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--orange { background: #fff3e0; color: #e65100; }

.actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: none;
}

.btn--edit {
  background: #e3f2fd;
  color: #1565c0;
}

.btn--delete {
  background: #ffebee;
  color: #c62828;
}

.btn-sm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #999;
}
</style>
