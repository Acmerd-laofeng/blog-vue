<template>
  <div class="admin-posts">
    <h1>后台文章管理</h1>
    <p class="admin-posts__tip">此功能正在开发中...</p>
    <router-link to="/" class="admin-posts__back">← 返回首页</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-posts {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.admin-posts__tip {
  color: #999;
  font-size: 1.2rem;
  margin: 24px 0;
}

.admin-posts__back {
  color: #42b883;
  text-decoration: none;
}

.admin-posts__back:hover {
  text-decoration: underline;
}
</style>
