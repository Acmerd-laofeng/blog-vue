import { supabase } from '../lib/supabase'

export const commentService = {
  // 获取某篇文章的评论
  async getByArticle(articleId) {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取评论失败:', error)
      return []
    }
    return data || []
  },

  // 获取所有评论 (后台管理用)
  async getAll() {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取所有评论失败:', error)
      return []
    }
    return data || []
  },

  // 发表评论
  async create(comment) {
    const { error } = await supabase
      .from('article_comments')
      .insert([{
        article_id: comment.articleId,
        user_name: comment.userName,
        content: comment.content
      }])
    
    if (error) {
      console.error('发表评论失败:', error)
      throw error
    }
    return true
  },

  // 删除评论
  async remove(id) {
    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除评论失败:', error)
      throw error
    }
    return true
  },

  // 切换置顶状态
  async togglePin(id, isPinned) {
    const { error } = await supabase
      .from('article_comments')
      .update({ is_pinned: !isPinned })
      .eq('id', id)
    
    if (error) {
      console.error('更新置顶状态失败:', error)
      throw error
    }
    return true
  },

  // 切换审核状态
  async toggleApprove(id, isApproved) {
    const { error } = await supabase
      .from('article_comments')
      .update({ is_approved: !isApproved })
      .eq('id', id)
    
    if (error) {
      console.error('更新审核状态失败:', error)
      throw error
    }
    return true
  }
}
