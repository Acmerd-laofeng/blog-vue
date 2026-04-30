<template>
  <div class="admin-form">
    <div class="admin-form__header">
      <h1>{{ isEdit ? '✏️ 编辑文章' : '➕ 写文章' }}</h1>
      <router-link to="/admin/articles" class="back-link">← 返回列表</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-grid">
        <div class="form-group full-width">
          <label>封面图 URL</label>
          <input v-model="form.cover_url" type="url" class="form-input" placeholder="https://... 建议使用 1464×915 尺寸" />
          <small class="form-hint">留空则显示默认图标</small>
        </div>

        <div class="form-group full-width">
          <label>文章标题 *</label>
          <input v-model="form.title" type="text" class="form-input" required placeholder="请输入文章标题" />
        </div>

        <div class="form-group">
          <label>日期</label>
          <input v-model="form.date" type="date" class="form-input" />
        </div>

        <div class="form-group">
          <label>分类</label>
          <input v-model="form.category" type="text" class="form-input" placeholder="如：技术、生活" />
        </div>

        <div class="form-group full-width">
          <label>摘要</label>
          <textarea v-model="form.summary" class="form-textarea" rows="2" placeholder="简短摘要..."></textarea>
        </div>

        <div class="form-group full-width">
          <label>正文 *</label>
          <RichTextEditor v-model="form.content" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="submitting">
          {{ submitting ? '保存中...' : (isEdit ? '保存修改' : '发布文章') }}
        </button>
        <router-link to="/admin/articles" class="btn btn--secondary">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '../../stores/articles'
import RichTextEditor from '../../components/RichTextEditor.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const isEdit = computed(() => route.name === 'admin-article-edit')
const submitting = ref(false)

const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  summary: '',
  content: '',
  cover_url: ''
})

onMounted(async () => {
  if (isEdit.value) {
    const article = articlesStore.getById(Number(route.params.id))
    if (article) {
      form.value = { ...article }
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await articlesStore.update(form.value.id, form.value)
    } else {
      await articlesStore.add(form.value)
    }
    router.push('/admin/articles')
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

.form-input, .form-textarea {
  padding: 10px 14px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
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
</style>
