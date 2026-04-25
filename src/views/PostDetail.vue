<template>
  <div class="post-detail">
    <div v-if="loading" class="post-detail__loading">加载中...</div>
    <div v-else-if="error" class="post-detail__error">{{ error }}</div>
    <article v-else-if="post" class="post-detail__article">
      <header class="post-detail__header">
        <h1 class="post-detail__title">{{ post.title }}</h1>
        <div class="post-detail__meta">
          <span class="post-detail__date">{{ post.date }}</span>
          <span class="post-detail__category">{{ post.category }}</span>
        </div>
      </header>
      <div class="post-detail__content">
        <p v-for="(paragraph, index) in post.content" :key="index">
          {{ paragraph }}
        </p>
      </div>
      <footer class="post-detail__footer">
        <router-link to="/" class="post-detail__back">← 返回首页</router-link>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '../stores/posts'

const route = useRoute()
const postsStore = usePostsStore()

const post = computed(() => postsStore.currentPost)
const loading = computed(() => postsStore.loading)
const error = computed(() => postsStore.error)

onMounted(() => {
  const id = parseInt(route.params.id)
  postsStore.fetchPostById(id)
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.post-detail__header {
  margin-bottom: 24px;
}

.post-detail__title {
  margin: 0 0 12px;
  font-size: 2rem;
  color: #333;
}

.post-detail__meta {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: #999;
}

.post-detail__category {
  background: #42b883;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
}

.post-detail__content {
  line-height: 1.8;
  color: #333;
}

.post-detail__content p {
  margin-bottom: 16px;
}

.post-detail__footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.post-detail__back {
  color: #42b883;
  text-decoration: none;
}

.post-detail__back:hover {
  text-decoration: underline;
}

.post-detail__loading,
.post-detail__error {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1.2rem;
}

.post-detail__error {
  color: #e74c3c;
}
</style>
