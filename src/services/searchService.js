import { supabase } from '../lib/supabase'

// 统一搜索服务
export const searchService = {
  // 搜索文章
  async searchArticles(query, limit = 20) {
    if (!query || query.trim() === '') return []
    
    const q = `%${query}%`
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.${q},summary.ilike.${q},content.ilike.${q}`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('搜索文章失败:', error)
      return []
    }
    return (data || []).map(item => ({ ...item, type: 'article' }))
  },

  // 搜索企业
  async searchCompanies(query, limit = 20) {
    if (!query || query.trim() === '') return []
    
    const q = `%${query}%`
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.${q},description.ilike.${q},industry.ilike.${q},city.ilike.${q},province.ilike.${q}`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('搜索企业失败:', error)
      return []
    }
    return (data || []).map(item => ({ ...item, type: 'company' }))
  },

  // 搜索作品
  async searchWorks(query, limit = 20) {
    if (!query || query.trim() === '') return []
    
    const q = `%${query}%`
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .or(`title.ilike.${q},description.ilike.${q}`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('搜索作品失败:', error)
      return []
    }
    return (data || []).map(item => ({ ...item, type: 'work' }))
  },

  // 全局搜索（同时搜索所有类型）
  async searchAll(query) {
    const [articles, companies, works] = await Promise.allSettled([
      this.searchArticles(query),
      this.searchCompanies(query),
      this.searchWorks(query)
    ])

    const results = {
      articles: articles.status === 'fulfilled' ? articles.value : [],
      companies: companies.status === 'fulfilled' ? companies.value : [],
      works: works.status === 'fulfilled' ? works.value : []
    }

    results.total = results.articles.length + results.companies.length + results.works.length
    return results
  }
}
