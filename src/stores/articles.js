import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleService } from '../services/articleService'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      articles.value = await articleService.getAll()
    } catch (e) {
      error.value = e.message || 'Failed to load articles'
      console.error('Store Load Error:', e)
    } finally {
      loading.value = false
    }
  }

  async function retryLoad() {
    await load()
  }

  async function add(article) {
    const data = await articleService.create(article)
    articles.value.unshift(data)
    return data
  }

  async function update(id, article) {
    await articleService.update(id, article)
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...article }
    }
  }

  async function remove(id) {
    await articleService.remove(id)
    articles.value = articles.value.filter(a => a.id !== id)
  }

  function getById(id) {
    return articles.value.find(a => a.id === id)
  }

  load()
  return { articles, loading, error, retryLoad, add, update, remove, getById }
})
