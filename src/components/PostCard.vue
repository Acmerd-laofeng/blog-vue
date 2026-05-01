<template>
  <div class="post-card" @click="$emit('click', post.id)">
    <div class="post-card__image">
      <img :src="post.cover" :alt="post.title" />
    </div>
    <div class="post-card__content">
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.excerpt }}</p>
      <div class="post-card__meta">
        <span class="post-card__date">{{ post.date }}</span>
        <span class="post-card__category">{{ post.category }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.post-card__image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-card__content {
  padding: 16px;
}

.post-card__title {
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: #333;
}

.post-card__excerpt {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.post-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.post-card__category {
  background: #42b883;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
