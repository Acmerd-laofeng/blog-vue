<template>
  <main class="container">
    <article v-if="post" class="article-container">
      <h1>{{ post.title }}</h1>
      <p class="article-date">📅 {{ post.date }}</p>
      <!-- 核心变化：使用 v-html 渲染 HTML -->
      <div class="article-body" v-html="postsStore.renderMarkdown(post.body)"></div>
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </article>
    <div v-else class="article-container">
      <p>文章未找到。</p>
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const postsStore = usePostsStore()

const postId = computed(() => route.params.id)
const post = computed(() => postsStore.getPostById(postId.value))
</script>

<style scoped>
.article-container {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}
.article-container h1 {
  font-size: 1.8rem;
  margin-bottom: 12px;
}
.article-date {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 24px;
}
.article-body {
  font-size: 1rem;
  line-height: 1.8;
}
.article-body h2 {
  margin-top: 24px;
  margin-bottom: 12px;
}
.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #00a1d6;
  text-decoration: none;
}
</style>
