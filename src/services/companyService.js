import { supabase } from '../lib/supabase'

// 企业数据服务
export const companyService = {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('获取企业列表失败:', error)
      return []
    }
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('获取企业详情失败:', error)
      return null
    }
    return data
  },

  async create(company) {
    const { data, error } = await supabase
      .from('companies')
      .insert([{
        name: company.name,
        province: company.province,
        city: company.city,
        industry: company.industry,
        size: company.size,
        schedule: company.schedule,
        salary: company.salary,
        rating: company.rating,
        description: company.description,
        website: company.website,
        tags: company.tags || []
      }])
      .select()
      .single()
    
    if (error) {
      console.error('添加企业失败:', error)
      throw error
    }
    return data
  },

  async update(id, company) {
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: company.name,
        province: company.province,
        city: company.city,
        industry: company.industry,
        size: company.size,
        schedule: company.schedule,
        salary: company.salary,
        rating: company.rating,
        description: company.description,
        website: company.website,
        tags: company.tags || []
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新企业失败:', error)
      throw error
    }
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除企业失败:', error)
      throw error
    }
  }
}
