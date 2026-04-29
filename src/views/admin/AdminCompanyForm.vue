<template>
  <div class="admin-form">
    <div class="admin-form__header">
      <h1>{{ isEdit ? '✏️ 编辑企业' : '➕ 添加企业' }}</h1>
      <router-link to="/admin/companies" class="back-link">← 返回列表</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-grid">
        <div class="form-group">
          <label>企业名称 *</label>
          <input v-model="form.name" type="text" class="form-input" required placeholder="如：腾讯科技" />
        </div>

        <div class="form-group">
          <label>省份 *</label>
          <input v-model="form.province" type="text" class="form-input" required placeholder="如：广东" />
        </div>

        <div class="form-group">
          <label>城市 *</label>
          <input v-model="form.city" type="text" class="form-input" required placeholder="如：深圳" />
        </div>

        <div class="form-group">
          <label>行业 *</label>
          <input v-model="form.industry" type="text" class="form-input" required placeholder="如：互联网" />
        </div>

        <div class="form-group">
          <label>公司规模</label>
          <input v-model="form.size" type="text" class="form-input" placeholder="如：10000+" />
        </div>

        <div class="form-group">
          <label>工作时间 *</label>
          <select v-model="form.schedule" class="form-input" required>
            <option value="">请选择</option>
            <option value="双休">双休</option>
            <option value="单休">单休</option>
            <option value="大小周">大小周</option>
          </select>
        </div>

        <div class="form-group">
          <label>薪资范围</label>
          <input v-model="form.salary" type="text" class="form-input" placeholder="如：15K-30K" />
        </div>

        <div class="form-group">
          <label>综合评分 (0-5)</label>
          <input v-model.number="form.rating" type="number" class="form-input" min="0" max="5" step="0.1" placeholder="4.5" />
        </div>

        <div class="form-group">
          <label>官方网站</label>
          <input v-model="form.website" type="url" class="form-input" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label>标签（逗号分隔）</label>
          <input v-model="tagsInput" type="text" class="form-input" placeholder="如：大厂,福利好,技术强" />
        </div>

        <div class="form-group full-width">
          <label>企业简介 *</label>
          <textarea v-model="form.description" class="form-textarea" required rows="4" placeholder="请输入企业简介..."></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="submitting">
          {{ submitting ? '保存中...' : (isEdit ? '保存修改' : '添加企业') }}
        </button>
        <router-link to="/admin/companies" class="btn btn--secondary">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompaniesStore } from '../../stores/companies'

const route = useRoute()
const router = useRouter()
const companiesStore = useCompaniesStore()
const isEdit = computed(() => route.name === 'admin-company-edit')
const submitting = ref(false)

const form = ref({
  name: '',
  province: '',
  city: '',
  industry: '',
  size: '',
  schedule: '',
  salary: '',
  rating: 4.0,
  description: '',
  website: '',
  tags: []
})

const tagsInput = ref('')

onMounted(async () => {
  if (isEdit.value) {
    const company = companiesStore.getById(Number(route.params.id))
    if (company) {
      form.value = { ...company }
      tagsInput.value = (company.tags || []).join('，')
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    form.value.tags = tagsInput.value.split(/[，,]/).filter(t => t.trim()).map(t => t.trim())

    if (isEdit.value) {
      await companiesStore.update(form.value.id, form.value)
    } else {
      await companiesStore.add(form.value)
    }
    router.push('/admin/companies')
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
