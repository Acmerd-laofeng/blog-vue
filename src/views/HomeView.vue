<script setup>
import { usePostsStore } from '@/stores/posts'
import PostCard from '@/components/PostCard.vue'
import ProfileCard from '@/components/ProfileCard.vue'

const postsStore = usePostsStore()
</script>

<template>
  <main class="container main-layout">
    <section class="post-list">
      <p>当前文章数量：{{ postsStore.posts.length }}</p>
      <PostCard v-for="post in postsStore.posts" :key="post.id" :post="post" />
    </section>
    <aside class="sidebar">
      <ProfileCard />
    </aside>
  </main>
</template>

<style scoped>
.main-layout {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.post-list {
  flex: 1;
  min-width: 0;
}
.sidebar {
  width: 280px;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}
</style>
