import { supabase } from '../lib/supabase'

/**
 * 上传图片到 Supabase Storage
 * @param {File} file - 图片文件
 * @param {string} bucket - 存储桶名称，默认 'images'
 * @returns {string|null} - 图片的公开 URL
 */
export async function uploadImage(file, bucket = 'images') {
  try {
    // 生成唯一文件名
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('上传失败:', error)
      // 如果存储桶不存在，返回 null
      if (error.message.includes('not found')) {
        alert('图片存储功能尚未配置，请先在 Supabase 后台创建 "images" 存储桶')
      }
      return null
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (err) {
    console.error('上传异常:', err)
    return null
  }
}

/**
 * 批量上传图片
 */
export async function uploadImages(files, bucket = 'images') {
  const urls = []
  for (const file of files) {
    const url = await uploadImage(file, bucket)
    if (url) urls.push(url)
  }
  return urls
}
