import { supabase } from '../lib/supabase'

export const articleService = {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('获取文章列表失败:', error)
      return []
    }
    return data || []
  },

  // 获取总数
  async getTotal() {
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
    if (error) return 0
    return count || 0
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('获取文章失败:', error)
      return null
    }
    return data
  },

  async create(article) {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        date: article.date,
        category: article.category,
        summary: article.summary,
        content: article.content,
        cover_url: article.cover_url || null,
        view_count: 0
      }])
      .select()
      .single()
    
    if (error) {
      console.error('创建文章失败:', error)
      throw error
    }
    return data
  },

  async update(id, article) {
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: article.title,
        date: article.date,
        category: article.category,
        summary: article.summary,
        content: article.content,
        cover_url: article.cover_url
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新文章失败:', error)
      throw error
    }
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除文章失败:', error)
      throw error
    }
  },

  async search(query) {
    if (!query || query.trim() === '') {
      return this.getAll()
    }
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('搜索文章失败:', error)
      return []
    }
    return data || []
  },

  // 增加浏览量 (异步执行，不阻塞页面)
  async incrementViews(id) {
    // 调用数据库中的 increment_view_count 函数
    // 如果函数不存在，这里会报错，但在 catch 中处理了，不会阻塞
    supabase.rpc('increment_view_count', { article_id: id })
      .catch(e => console.warn('View increment failed (check if RPC exists):', e))
  },

  // 获取热门文章 (按浏览量排序)
  async getHotArticles(limit = 5) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, view_count, cover_url')
      .order('view_count', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('获取热门文章失败:', error)
      return []
    }
    return data || []
  }
}
