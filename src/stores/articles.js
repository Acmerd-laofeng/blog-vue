import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const nextId = ref(100)

  function load() {
    const saved = localStorage.getItem('acmerd-articles')
    if (saved) {
      articles.value = JSON.parse(saved)
    } else {
      articles.value = []
      save()
    }
    nextId.value = Math.max(...articles.value.map(a => a.id), 0) + 1
  }

  function save() {
    localStorage.setItem('acmerd-articles', JSON.stringify(articles.value))
  }

  function add(article) {
    article.id = nextId.value++
    article.createdAt = new Date().toISOString().split('T')[0]
    article.updatedAt = article.createdAt
    articles.value.unshift(article)
    save()
    return article
  }

  function update(id, data) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] }
      save()
      return true
    }
    return false
  }

  function remove(id) {
    articles.value = articles.value.filter(a => a.id !== id)
    save()
  }

  function getById(id) {
    return articles.value.find(a => a.id === id)
  }

  load()
  return { articles, add, update, remove, getById }
})
