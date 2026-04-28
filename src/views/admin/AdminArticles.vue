<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <h1>📝 文章管理</h1>
      <router-link to="/admin/articles/new" class="btn btn--primary">➕ 写文章</router-link>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>分类</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articlesStore.articles" :key="article.id">
            <td>{{ article.id }}</td>
            <td><strong>{{ article.title }}</strong></td>
            <td>{{ article.category || '-' }}</td>
            <td>{{ article.date }}</td>
            <td class="actions">
              <router-link :to="`/admin/articles/edit/${article.id}`" class="btn-sm btn--edit">编辑</router-link>
              <button @click="handleDelete(article)" class="btn-sm btn--delete">删除</button>
            </td>
          </tr>
          <tr v-if="articlesStore.articles.length === 0">
            <td colspan="5" class="empty-row">暂无文章</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useArticlesStore } from '../../stores/articles'

const articlesStore = useArticlesStore()

function handleDelete(article) {
  if (confirm(`确定要删除"${article.title}"吗？`)) {
    articlesStore.remove(article.id)
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
  overflow: hidden;
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
