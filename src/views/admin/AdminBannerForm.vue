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
          <label>图片 URL *</label>
          <input v-model="form.image_url" type="url" class="form-input" required placeholder="https://... 建议使用 GitHub 或图床图片链接" />
          <small class="form-hint">建议尺寸：1464 × 600 像素 | 推荐用 GitHub 仓库存图</small>
        </div>

        <div class="form-group">
          <label>关联文章</label>
          <select v-model="form.article_id" class="form-input">
            <option :value="null">无（使用下方链接 URL）</option>
            <option v-for="article in articles" :key="article.id" :value="article.id">
              {{ article.title }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>链接 URL（无关联文章时生效）</label>
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
import { articleService } from '../../services/articleService'

const route = useRoute()
const router = useRouter()
const bannersStore = useBannersStore()
const isEdit = computed(() => route.name === 'admin-banner-edit')
const submitting = ref(false)

const form = ref({
  title: '',
  image_url: '',
  link_url: '',
  article_id: null,
  sort_order: 0,
  is_active: true
})

const articles = ref([])

onMounted(async () => {
  // 加载文章列表
  articles.value = await articleService.getAll(1, 100)
  
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
  border-color: #2C54FB;
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
</style>
