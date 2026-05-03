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
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('search_stats')
        .select('query')
        .gt('created_at', sevenDaysAgo)
      
      if (error) throw error
      
      // 客户端分组统计
      const counts = {}
      for (const row of (data || [])) {
        const q = row.query.toLowerCase().trim()
        counts[q] = (counts[q] || 0) + 1
      }
      
      // 排序并截取 Top N
      return Object.entries(counts)
        .map(([query, search_count]) => ({ query, search_count }))
        .sort((a, b) => b.search_count - a.search_count)
        .slice(0, limit)
    } catch (e) {
      console.error('Failed to get top searches:', e)
      return []
    }
  }
}
