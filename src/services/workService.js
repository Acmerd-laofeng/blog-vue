import { supabase } from '../lib/supabase'

export const workService = {
  async getAll() {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取作品列表失败:', error)
      return []
    }
    return data || []
  },
  
  async create(work) {
    const { data, error } = await supabase
      .from('works')
      .insert([{
        title: work.title,
        description: work.description,
        image_url: work.image_url
      }])
      .select()
      .single()
    
    if (error) {
      console.error('创建作品失败:', error)
      throw error
    }
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('works').delete().eq('id', id)
    if (error) throw error
  }
}
