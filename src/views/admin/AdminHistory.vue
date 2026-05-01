<template>
  <div class="admin-page">
    <div class="admin-page__header">
      <h1> 历史内容管理</h1>
      <router-link to="/admin/dashboard" class="back-link">← 返回仪表盘</router-link>
    </div>
    <div class="empty-state">
      <p>历史归档功能开发中...</p>
      <p>可以在这里管理历史内容的归档和展示</p>
    </div>
  </div>
</template>

<script setup>
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

.back-link {
  color: #2C54FB;
  text-decoration: none;
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  color: #999;
}
</style>
