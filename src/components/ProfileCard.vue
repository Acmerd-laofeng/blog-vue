<template>
  <div class="profile-card">
    <div class="profile-card__avatar">
      <img :src="avatar" alt="Avatar" />
    </div>
    <h2 class="profile-card__name">{{ name }}</h2>
    <p class="profile-card__bio">{{ bio }}</p>
    <div class="profile-card__stats">
      <div class="profile-card__stat">
        <span class="profile-card__stat-number">{{ postCount }}</span>
        <span class="profile-card__stat-label">文章</span>
      </div>
      <div class="profile-card__stat">
        <span class="profile-card__stat-number">{{ categoryCount }}</span>
        <span class="profile-card__stat-label">分类</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: '博主名称'
  },
  avatar: {
    type: String,
    default: '/src/assets/logo.svg'
  },
  bio: {
    type: String,
    default: '这是一个博客，记录学习和生活。'
  },
  postCount: {
    type: Number,
    default: 0
  },
  categoryCount: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card__avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.profile-card__name {
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: #333;
}

.profile-card__bio {
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: #666;
}

.profile-card__stats {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.profile-card__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-card__stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b883;
}

.profile-card__stat-label {
  font-size: 0.8rem;
  color: #999;
}
</style>
