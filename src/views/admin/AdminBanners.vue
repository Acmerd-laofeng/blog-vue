<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <h1>🎠 轮播图管理</h1>
      <router-link to="/admin/banners/new" class="btn btn--primary">➕ 添加轮播图</router-link>
    </div>

    <div v-if="bannersStore.loading" class="loading">加载中...</div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>图片</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in bannersStore.banners" :key="banner.id">
            <td>{{ banner.id }}</td>
            <td><strong>{{ banner.title }}</strong></td>
            <td>
              <img :src="banner.image_url" alt="" class="banner-thumb" />
            </td>
            <td>{{ banner.sort_order }}</td>
            <td>
              <span class="badge" :class="banner.is_active ? 'badge--green' : 'badge--red'">
                {{ banner.is_active ? '显示' : '隐藏' }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/admin/banners/edit/${banner.id}`" class="btn-sm btn--edit">编辑</router-link>
              <button @click="handleDelete(banner)" class="btn-sm btn--delete">删除</button>
            </td>
          </tr>
          <tr v-if="!bannersStore.loading && bannersStore.banners.length === 0">
            <td colspan="6" class="empty-row">暂无轮播图</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useBannersStore } from '../../stores/banners'

const bannersStore = useBannersStore()

function handleDelete(banner) {
  if (confirm(`确定要删除"${banner.title}"吗？`)) {
    bannersStore.remove(banner.id)
  }
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
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
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

.banner-thumb {
  width: 80px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }

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

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #999;
}
</style>
