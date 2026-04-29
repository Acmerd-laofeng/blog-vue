import { supabase } from '../lib/supabase'

export const articleService = {
  async getAll() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取文章列表失败:', error)
      return []
    }
    return data || []
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
        content: article.content
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
        content: article.content
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
  }
}
