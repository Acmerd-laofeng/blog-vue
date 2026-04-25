import { defineStore } from 'pinia'
import { mockPosts } from '../utils/mockPosts'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  }),

  getters: {
    allPosts: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find(post => post.id === id),
    categories: (state) => [...new Set(state.posts.map(post => post.category))]
  },

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        // 模拟异步获取数据
        await new Promise(resolve => setTimeout(resolve, 300))
        this.posts = mockPosts
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchPostById(id) {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 200))
        const post = mockPosts.find(p => p.id === id)
        if (post) {
          this.currentPost = post
        } else {
          this.error = '文章不存在'
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
