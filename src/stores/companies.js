import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 初始示例数据
const defaultCompanies = [
  {
    id: 1,
    name: '腾讯科技',
    city: '深圳',
    province: '广东',
    industry: '互联网',
    size: '10000+',
    schedule: '双休',
    salary: '15K-30K',
    rating: 4.5,
    description: '腾讯是一家领先的互联网科技公司，主营社交、游戏、金融科技等业务。',
    tags: ['大厂', '福利好', '技术强'],
    createdAt: '2026-04-28'
  },
  {
    id: 2,
    name: '华为技术',
    city: '深圳',
    province: '广东',
    industry: '通信/硬件',
    size: '10000+',
    schedule: '大小周',
    salary: '20K-40K',
    rating: 4.2,
    description: '华为是全球领先的通信设备和智能终端提供商。',
    tags: ['大厂', '薪资高', '加班多'],
    createdAt: '2026-04-28'
  },
  {
    id: 3,
    name: '字节跳动',
    city: '北京',
    province: '北京',
    industry: '互联网',
    size: '10000+',
    schedule: '双休',
    salary: '18K-35K',
    rating: 4.3,
    description: '字节跳动是全球领先的短视频和资讯平台。',
    tags: ['大厂', '成长快', '扁平管理'],
    createdAt: '2026-04-28'
  }
]

export const useCompaniesStore = defineStore('companies', () => {
  const companies = ref([])
  const nextId = ref(100)

  function load() {
    const saved = localStorage.getItem('acmerd-companies')
    if (saved) {
      companies.value = JSON.parse(saved)
    } else {
      companies.value = [...defaultCompanies]
      save()
    }
    nextId.value = Math.max(...companies.value.map(c => c.id), 0) + 1
  }

  function save() {
    localStorage.setItem('acmerd-companies', JSON.stringify(companies.value))
  }

  function add(company) {
    company.id = nextId.value++
    company.createdAt = new Date().toISOString().split('T')[0]
    companies.value.unshift(company)
    save()
    return company
  }

  function update(id, data) {
    const idx = companies.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      companies.value[idx] = { ...companies.value[idx], ...data }
      save()
      return true
    }
    return false
  }

  function remove(id) {
    companies.value = companies.value.filter(c => c.id !== id)
    save()
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
        c.description.toLowerCase().includes(q) ||
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
  return { companies, add, update, remove, getById, search, cities, provinces, industries, schedules }
})
