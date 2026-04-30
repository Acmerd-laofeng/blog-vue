import { supabase } from '../lib/supabase'

export const commentService = {
  // 获取某篇文章的评论
  async getByArticle(articleId) {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取评论失败:', error)
      return []
    }
    return data || []
  },

  // 发表评论
  async create(comment) {
    const { data, error } = await supabase
      .from('article_comments')
      .insert([{
        article_id: comment.articleId,
        user_name: comment.userName,
        content: comment.content
      }])
      .select()
      .single()
    
    if (error) {
      console.error('发表评论失败:', error)
      throw error
    }
    return data
  }
}
