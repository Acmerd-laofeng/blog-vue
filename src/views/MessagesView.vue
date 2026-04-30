<template>
  <div class="page-placeholder">
    <div class="page-placeholder__content">
      <h1> 消息中心</h1>
      <p>系统通知与私信，功能开发中...</p>
      <router-link to="/admin/messages" class="btn btn--primary">后台管理</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-placeholder {
  max-width: 1464px;
  margin: 0 auto;
  padding: 24px 20px;
}

.page-placeholder__content {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.page-placeholder__content h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
}

.page-placeholder__content p {
  color: #666;
  margin-bottom: 24px;
}

.btn {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
</style>
