<template>
  <div class="admin-works">
    <div class="admin-header">
      <h1>🎨 作品管理</h1>
      <p>上传和管理艺术作品</p>
    </div>

    <!-- 上传表单 -->
    <div class="upload-section">
      <h2>上传新作品</h2>
      <form @submit.prevent="handleSubmit" class="upload-form">
        <div class="form-group">
          <label>作品标题 *</label>
          <input v-model="form.title" type="text" placeholder="输入作品名称" required />
        </div>

        <div class="form-group">
          <label>作品描述</label>
          <textarea v-model="form.description" rows="3" placeholder="输入作品描述（可选）"></textarea>
        </div>

        <div class="form-group">
          <label>作品图片 *</label>
          <div class="upload-area" @click="triggerFileInput" :class="{ 'has-preview': previewUrl }">
            <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
            <div v-else class="upload-placeholder">
              <span class="upload-icon">📁</span>
              <p>点击选择图片</p>
              <p class="hint">支持 JPG, PNG, WEBP</p>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" hidden />
        </div>

        <div v-if="uploading" class="upload-progress">
          <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
          <span>上传中 {{ uploadProgress }}%...</span>
        </div>

        <button type="submit" :disabled="!canSubmit || uploading" class="btn-submit">
          {{ uploading ? '上传中...' : '发布作品' }}
        </button>
      </form>
    </div>

    <!-- 作品列表 -->
    <div class="works-list">
      <h2>已上传作品 ({{ works.length }})</h2>
      <div v-if="works.length === 0" class="empty">暂无作品</div>
      <div v-else class="works-table">
        <div v-for="work in works" :key="work.id" class="work-row">
          <img :src="work.image_url" :alt="work.title" class="thumb" />
          <div class="work-info">
            <h3>{{ work.title }}</h3>
            <p>{{ work.description || '无描述' }}</p>
          </div>
          <button class="btn-delete" @click="handleDelete(work.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { workService } from '../services/workService'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const works = ref([])
const form = ref({ title: '', description: '' })
const selectedFile = ref(null)
const previewUrl = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

const canSubmit = computed(() => {
  return form.value.title && (selectedFile.value || previewUrl.value)
})

onMounted(async () => {
  await loadWorks()
})

async function loadWorks() {
  works.value = await workService.getAll()
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  if (!authStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    let imageUrl = ''

    // 如果有本地文件，先上传
    if (selectedFile.value) {
      const fileName = `${Date.now()}-${selectedFile.value.name}`
      const { data, error } = await supabase.storage
        .from('works-images')
        .upload(fileName, selectedFile.value, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // 获取公开 URL
      const { data: urlData } = supabase.storage
        .from('works-images')
        .getPublicUrl(data.path)
      
      imageUrl = urlData.publicUrl
    }

    // 写入数据库
    await workService.create({
      title: form.value.title,
      description: form.value.description,
      image_url: imageUrl
    })

    // 重置表单
    form.value = { title: '', description: '' }
    selectedFile.value = null
    previewUrl.value = ''
    uploadProgress.value = 100

    // 刷新列表
    await loadWorks()

    alert('作品发布成功！')
  } catch (err) {
    console.error('上传失败:', err)
    alert('上传失败: ' + (err.message || '未知错误'))
  } finally {
    uploading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('确定要删除这个作品吗？')) return
  
  try {
    await workService.remove(id)
    await loadWorks()
  } catch (err) {
    console.error('删除失败:', err)
    alert('删除失败')
  }
}
</script>

<style scoped>
.admin-works {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 2rem;
  color: #1d1d1f;
}

.admin-header p {
  color: #86868b;
}

.upload-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.upload-section h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: #007aff;
}

.upload-area.has-preview {
  padding: 0;
  border-style: solid;
}

.upload-icon {
  font-size: 3rem;
}

.hint {
  font-size: 0.8rem;
  color: #999;
}

.preview-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 6px;
}

.upload-progress {
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 24px;
}

.progress-bar {
  height: 100%;
  background: #007aff;
  transition: width 0.3s;
}

.upload-progress span {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
}

.btn-submit {
  background: #007aff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0056b3;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 作品列表 */
.works-list h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.works-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.work-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.work-info {
  flex: 1;
}

.work-info h3 {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}

.work-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.btn-delete {
  background: #ff3b30;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #e02e24;
}

.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}
</style>
