<template>
  <div class="home">
    <div class="home__sidebar">
      <ProfileCard
        :post-count="posts.length"
        :category-count="categories.length"
      />
    </div>
    <div class="home__main">
      <h1 class="home__title">博客文章</h1>
      <div v-if="loading" class="home__loading">加载中...</div>
      <div v-else class="home__posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="goToPost"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import PostCard from '../components/PostCard.vue'
import ProfileCard from '../components/ProfileCard.vue'

const router = useRouter()
const postsStore = usePostsStore()

const posts = computed(() => postsStore.posts)
const categories = computed(() => postsStore.categories)
const loading = computed(() => postsStore.loading)

onMounted(() => {
  postsStore.fetchPosts()
})

function goToPost(id) {
  router.push({ name: 'post-detail', params: { id } })
}
</script>

<style scoped>
.home {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.home__sidebar {
  width: 280px;
  flex-shrink: 0;
}

.home__main {
  flex: 1;
}

.home__title {
  margin: 0 0 24px;
  font-size: 2rem;
  color: #333;
}

.home__posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.home__loading {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .home {
    flex-direction: column;
  }

  .home__sidebar {
    width: 100%;
  }

  .home__posts {
    grid-template-columns: 1fr;
  }
}
</style>
