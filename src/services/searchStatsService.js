// src/services/searchStatsService.js
// 搜索统计服务 - 记录用户搜索行为

import { supabase } from '../lib/supabase'

export const searchStatsService = {
  // 记录一次搜索
  async trackSearch(query, resultsCount = 0) {
    if (!query || query.trim().length < 2) return

    try {
      const { error } = await supabase
        .from('search_stats')
        .insert({
          query: query.trim().toLowerCase(),
          results_count: resultsCount
        })
      
      if (error) console.error('Failed to track search:', error)
    } catch (e) {
      console.error('Search stats error:', e)
    }
  },

  // 获取热门搜索 (最近 7 天 Top 20)
  async getTopSearches(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('search_stats')
        .select('query, count(*) as search_count')
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .group('query')
        .order('search_count', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    } catch (e) {
      console.error('Failed to get top searches:', e)
      return []
    }
  }
}
