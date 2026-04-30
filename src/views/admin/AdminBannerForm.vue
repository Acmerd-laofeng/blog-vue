<template>
  <div class="admin-form">
    <div class="admin-form__header">
      <h1>{{ isEdit ? '✏️ 编辑轮播图' : '➕ 添加轮播图' }}</h1>
      <router-link to="/admin/banners" class="back-link">← 返回列表</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-grid">
        <div class="form-group full-width">
          <label>标题</label>
          <input v-model="form.title" type="text" class="form-input" placeholder="如：Acmerd 正式上线" />
        </div>

        <div class="form-group full-width">
          <label>图片 *</label>
          <div class="image-upload-area">
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="预览" />
              <button type="button" class="image-remove" @click="removeImage">✕ 移除</button>
            </div>
            <label v-else class="image-upload-btn" :class="{ 'is-uploading': uploading }">
              <input
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageUpload"
                :disabled="uploading"
              />
              <div class="upload-placeholder">
                <svg v-if="!uploading" viewBox="0 0 24 24" width="48" height="48"><path fill="#999" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                <div v-else class="upload-spinner"></div>
                <p>{{ uploading ? '上传中...' : '点击选择本地图片' }}</p>
                <small>建议尺寸：1464 × 600 像素</small>
              </div>
            </label>
          </div>
          <input v-if="!imagePreview" v-model="form.image_url" type="url" class="form-input" placeholder="或直接粘贴图片 URL" style="margin-top: 8px" />
        </div>

        <div class="form-group">
          <label>链接 URL</label>
          <input v-model="form.link_url" type="url" class="form-input" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label>排序（数字越小越靠前）</label>
          <input v-model.number="form.sort_order" type="number" class="form-input" placeholder="0" />
        </div>

        <div class="form-group">
          <label>状态</label>
          <select v-model="form.is_active" class="form-input">
            <option :value="true">显示</option>
            <option :value="false">隐藏</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="submitting">
          {{ submitting ? '保存中...' : (isEdit ? '保存修改' : '添加轮播图') }}
        </button>
        <router-link to="/admin/banners" class="btn btn--secondary">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBannersStore } from '../../stores/banners'
import { uploadImage } from '../../utils/imageUpload'

const route = useRoute()
const router = useRouter()
const bannersStore = useBannersStore()
const isEdit = computed(() => route.name === 'admin-banner-edit')
const submitting = ref(false)

const form = ref({
  title: '',
  image_url: '',
  link_url: '',
  sort_order: 0,
  is_active: true
})

const imagePreview = computed(() => {
  return form.value.image_url || ''
})

const uploading = ref(false)

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    // 先显示预览
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.image_url = e.target.result
    }
    reader.readAsDataURL(file)

    // 上传到 Supabase Storage
    const url = await uploadImage(file)
    if (url) {
      form.value.image_url = url
    } else {
      // 如果上传失败，保持 base64 预览
      console.warn('Storage 上传失败，使用 base64')
    }
  } catch (err) {
    console.error('图片处理失败:', err)
    alert('图片处理失败')
  } finally {
    uploading.value = false
  }
}

function removeImage() {
  form.value.image_url = ''
}

onMounted(() => {
  if (isEdit.value) {
    const banner = bannersStore.banners.find(b => b.id === Number(route.params.id))
    if (banner) {
      form.value = { ...banner }
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await bannersStore.update(form.value.id, form.value)
    } else {
      await bannersStore.add(form.value)
    }
    router.push('/admin/banners')
  } catch (error) {
    alert('保存失败：' + error.message)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-form {
  padding: 32px;
}

.admin-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-form__header h1 {
  font-size: 1.5rem;
  color: #333;
}

.back-link {
  color: #667eea;
  text-decoration: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 24px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.form-hint {
  font-size: 0.8rem;
  color: #999;
}

.form-input {
  padding: 10px 14px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--secondary {
  background: #f0f0f0;
  color: #666;
}

.image-upload-area {
  width: 100%;
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #eee;
}

.image-preview img {
  width: 100%;
  display: block;
  max-height: 400px;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.image-remove:hover {
  background: rgba(0,0,0,0.8);
}

.image-upload-btn {
  display: block;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #999;
  transition: all 0.2s;
}

.upload-placeholder:hover {
  background: #f0f7ff;
  border-color: #667eea;
}

.upload-placeholder p {
  margin: 12px 0 4px;
  font-size: 0.95rem;
}

.upload-placeholder small {
  font-size: 0.8rem;
  color: #bbb;
}

.upload-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #ddd;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.image-upload-btn.is-uploading {
  pointer-events: none;
  opacity: 0.7;
}
</style>
