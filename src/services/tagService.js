import { supabase } from '../lib/supabase'

export const tagService = {
  // 获取所有标签
  async getAll() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('获取标签失败:', error)
      return []
    }
    return data || []
  },
  
  // 创建标签
  async create(name, color = '#007aff') {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name, color }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // 删除标签
  async remove(id) {
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (error) throw error
  },
  
  // 获取文章的所有标签
  async getArticleTags(articleId) {
    const { data, error } = await supabase
      .from('article_tags')
      .select('tags(*)')
      .eq('article_id', articleId)
    
    if (error) {
      console.error('获取文章标签失败:', error)
      return []
    }
    return (data || []).map(r => r.tags).filter(Boolean)
  },
  
  // 为文章设置标签
  async setArticleTags(articleId, tagIds) {
    // 先删除旧标签
    await supabase.from('article_tags').delete().eq('article_id', articleId)
    
    if (tagIds.length === 0) return
    
    // 插入新标签
    const inserts = tagIds.map(tagId => ({ article_id: articleId, tag_id: tagId }))
    const { error } = await supabase.from('article_tags').insert(inserts)
    if (error) throw error
  },
  
  // 按标签筛选文章
  async getByTag(tagId, page = 1, limit = 12) {
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('article_tags')
      .select('articles(*)')
      .eq('tag_id', tagId)
      .order('created_at', { foreignTable: 'articles', ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('按标签筛选失败:', error)
      return []
    }
    return (data || []).map(r => r.articles).filter(Boolean)
  }
}
