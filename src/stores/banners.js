import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bannerService } from '../services/bannerService'

export const useBannersStore = defineStore('banners', () => {
  const banners = ref([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      banners.value = await bannerService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function add(banner) {
    const data = await bannerService.create(banner)
    banners.value.push(data)
    return data
  }

  async function update(id, banner) {
    await bannerService.update(id, banner)
    const idx = banners.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      banners.value[idx] = { ...banners.value[idx], ...banner }
    }
  }

  async function remove(id) {
    await bannerService.remove(id)
    banners.value = banners.value.filter(b => b.id !== id)
  }

  load()
  return { banners, loading, add, update, remove }
})
