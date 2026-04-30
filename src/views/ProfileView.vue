<template>
  <div class="profile">
    <div class="profile__header">
      <h1>👤 个人中心</h1>
      <p>账号设置与个人信息</p>
    </div>
    <div class="profile__empty">
      <p>功能开发中，敬请期待...</p>
      <router-link to="/admin/profile" class="btn btn--primary">后台管理</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile {
  max-width: 1464px;
  margin: 0 auto;
  padding: 24px 20px;
}

.profile__header {
  margin-bottom: 24px;
}

.profile__header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 4px;
}

.profile__header p {
  color: #666;
}

.profile__empty {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
}

.profile__empty p {
  color: #999;
  margin-bottom: 16px;
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
