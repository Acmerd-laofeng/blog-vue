<template>
  <div class="admin-form">
    <div class="admin-form__header">
      <h1><Icon name="edit" class="header-icon" /> {{ isEdit ? '编辑文章' : '写文章' }}</h1>
      <router-link to="/admin/articles" class="back-link"><Icon name="arrow-left" class="back-icon" /> 返回列表</router-link>
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
          <label>标签</label>
          <div class="tag-selector">
            <div class="selected-tags">
              <span v-for="tag in selectedTags" :key="tag.id" class="selected-tag" :style="{ background: tag.color }">
                {{ tag.name }}
                <button type="button" @click="removeTag(tag)" class="remove-tag">×</button>
              </span>
            </div>
            <div class="available-tags">
              <button type="button" v-for="tag in availableTags" :key="tag.id" class="add-tag-btn" @click="addTag(tag)">
                + {{ tag.name }}
              </button>
              <div class="new-tag-input">
                <input v-model="newTagName" type="text" placeholder="新标签名称" class="form-input-sm" />
                <button type="button" @click="createNewTag" class="btn-sm">创建</button>
              </div>
            </div>
          </div>
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
import { useAuthStore } from '../../stores/auth'
import { tagService } from '../../services/tagService'
import RichTextEditor from '../../components/RichTextEditor.vue'
import Icon from '../../components/Icons.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()
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

// 标签相关
const allTags = ref([])
const selectedTags = ref([])
const newTagName = ref('')

const availableTags = computed(() => {
  const selectedIds = selectedTags.value.map(t => t.id)
  return allTags.value.filter(t => !selectedIds.includes(t.id))
})

onMounted(async () => {
  // 加载所有标签
  allTags.value = await tagService.getAll()

  if (isEdit.value) {
    const article = articlesStore.getById(Number(route.params.id))
    if (article) {
      form.value = { ...article }
      // 加载文章标签
      const articleTags = await tagService.getArticleTags(article.id)
      selectedTags.value = articleTags
    }
  }
})

function addTag(tag) {
  selectedTags.value.push(tag)
}

function removeTag(tag) {
  selectedTags.value = selectedTags.value.filter(t => t.id !== tag.id)
}

async function createNewTag() {
  const name = newTagName.value.trim()
  if (!name) return

  try {
    const colors = ['#007aff', '#34c759', '#ff9500', '#ff3b30', '#5856d6', '#af52de']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const tag = await tagService.create(name, color)
    allTags.value.push(tag)
    selectedTags.value.push(tag)
    newTagName.value = ''
  } catch (err) {
    alert('创建标签失败：' + err.message)
  }
}

async function handleSubmit() {
  submitting.value = true
  try {
    let articleId
    if (isEdit.value) {
      await articlesStore.update(form.value.id, form.value)
      articleId = form.value.id
    } else {
      const articleData = { ...form.value, user_id: authStore.user?.id }
      const article = await articlesStore.add(articleData)
      articleId = article.id
    }

    // 保存标签关联
    const tagIds = selectedTags.value.map(t => t.id)
    await tagService.setArticleTags(articleId, tagIds)

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
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 1.3rem;
  height: 1.3rem;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

.back-link {
  color: #2C54FB;
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
  border-color: #2C54FB;
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
  background: linear-gradient(135deg, #2C54FB, #2C54FB);
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

/* 标签选择器 */
.tag-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.remove-tag {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
}

.remove-tag:hover {
  opacity: 1;
}

.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.add-tag-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-tag-btn:hover {
  border-color: #2C54FB;
  color: #2C54FB;
}

.new-tag-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-input-sm {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
  width: 120px;
}

.btn-sm {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  background: #2C54FB;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
}
</style>
