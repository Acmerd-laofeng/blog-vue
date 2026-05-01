import { supabase } from '../lib/supabase'

export const interactionService = {
  // --- 点赞相关 ---
  
  // 检查是否已点赞
  async checkLike(targetType, targetId, userId) {
    if (!userId) return false
    const { data } = await supabase
      .from('user_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()
    return !!data
  },

  // 切换点赞状态
  async toggleLike(targetType, targetId, userId, isLiked) {
    if (!userId) throw new Error('请先登录')
    
    if (isLiked) {
      const { error } = await supabase
        .from('user_likes')
        .delete()
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
      if (error) throw error
      return false
    } else {
      const { error } = await supabase
        .from('user_likes')
        .insert([{ user_id: userId, target_type: targetType, target_id: targetId }])
      if (error) throw error
      return true
    }
  },

  // --- 收藏相关 ---

  // 检查是否已收藏
  async checkFavorite(targetType, targetId, userId) {
    if (!userId) return false
    const { data } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()
    return !!data
  },

  // 切换收藏状态
  async toggleFavorite(targetType, targetId, userId, isFavorited) {
    if (!userId) throw new Error('请先登录')
    
    if (isFavorited) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
      if (error) throw error
      return false
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: userId, target_type: targetType, target_id: targetId }])
      if (error) throw error
      return true
    }
  },

  // --- 获取我的收藏列表 ---
  async getMyFavorites(userId) {
    if (!userId) return []
    
    // 获取收藏的文章
    const { data: articles, error: err1 } = await supabase
      .from('user_favorites')
      .select('target_id, articles(title, date, category, summary)')
      .eq('user_id', userId)
      .eq('target_type', 'article')
    
    if (err1) console.warn('Failed to fetch articles', err1)

    // 获取收藏的企业
    const { data: companies, error: err2 } = await supabase
      .from('user_favorites')
      .select('target_id, companies(name, city, schedule)')
      .eq('user_id', userId)
      .eq('target_type', 'company')

    if (err2) console.warn('Failed to fetch companies', err2)

    return {
      articles: articles?.map(a => a.articles).filter(Boolean) || [],
      companies: companies?.map(c => c.companies).filter(Boolean) || []
    }
  }
}
