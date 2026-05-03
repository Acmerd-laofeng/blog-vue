import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { companyService } from '../services/companyService'

export const useCompaniesStore = defineStore('companies', () => {
  const companies = ref([])
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)
  const limit = 12 // 每页加载数量

  async function load() {
    loading.value = true
    page.value = 1
    hasMore.value = true
    try {
      const result = await companyService.getAll(page.value, limit)
      companies.value = result
      hasMore.value = result.length >= limit
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    page.value++
    try {
      const result = await companyService.getAll(page.value, limit)
      companies.value = [...companies.value, ...result]
      hasMore.value = result.length >= limit
    } catch (e) {
      console.error('Load More Error:', e)
    } finally {
      loading.value = false
    }
  }

  async function add(company) {
    const data = await companyService.create(company)
    companies.value.unshift(data)
    return data
  }

  async function update(id, company) {
    await companyService.update(id, company)
    const idx = companies.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      companies.value[idx] = { ...companies.value[idx], ...company }
    }
  }

  async function remove(id) {
    await companyService.remove(id)
    companies.value = companies.value.filter(c => c.id !== id)
  }

  function getById(id) {
    return companies.value.find(c => c.id === id)
  }

  const cities = computed(() => [...new Set(companies.value.map(c => c.city))].sort())
  const provinces = computed(() => [...new Set(companies.value.map(c => c.province))].sort())
  const industries = computed(() => [...new Set(companies.value.map(c => c.industry))].sort())
  const schedules = computed(() => [...new Set(companies.value.map(c => c.schedule))].sort())

  function search(query, filters = {}) {
    let result = [...companies.value]
    
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.province) result = result.filter(c => c.province === filters.province)
    if (filters.city) result = result.filter(c => c.city === filters.city)
    if (filters.industry) result = result.filter(c => c.industry === filters.industry)
    if (filters.schedule) result = result.filter(c => c.schedule === filters.schedule)

    return result
  }

  load()
  return { companies, loading, hasMore, loadMore, add, update, remove, getById, search, cities, provinces, industries, schedules }
})
