import { supabase } from '../lib/supabase'

export const bannerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('获取轮播图失败:', error)
      return []
    }
    return data || []
  },

  async create(banner) {
    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title: banner.title,
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        sort_order: banner.sort_order || 0,
        is_active: banner.is_active !== false
      }])
      .select()
      .single()
    
    if (error) {
      console.error('创建轮播图失败:', error)
      throw error
    }
    return data
  },

  async update(id, banner) {
    const { data, error } = await supabase
      .from('banners')
      .update({
        title: banner.title,
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        sort_order: banner.sort_order || 0,
        is_active: banner.is_active !== false
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新轮播图失败:', error)
      throw error
    }
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除轮播图失败:', error)
      throw error
    }
  }
}
