<template>
 <div class="admin-form">
 <div class="admin-form__header">
 <h1><Icon name="edit" /> ' : ' ' }}</h1>
 <router-link to="/admin/companies" class="back-link">← </router-link>
 </div>

 <form @submit.prevent="handleSubmit" class="form">
 <div class="form-grid">
 <div class="form-group">
 <label></label>
 <input v-model="form.name" type="text" class="form-input" placeholder="" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.province" type="text" class="form-input" placeholder="" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.city" type="text" class="form-input" placeholder="" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.industry" type="text" class="form-input" placeholder="" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.size" type="text" class="form-input" placeholder="10000+" />
 </div>

 <div class="form-group">
 <label></label>
 <select v-model="form.schedule" class="form-input">
 <option value=""></option>
 <option value=""></option>
 <option value=""></option>
 <option value=""></option>
 </select>
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.salary" type="text" class="form-input" placeholder="15K-30K" />
 </div>

 <div class="form-group">
 <label> (0-5)</label>
 <input v-model.number="form.rating" type="number" class="form-input" min="0" max="5" step="0.1" placeholder="4.5" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.website" type="url" class="form-input" placeholder="https://..." />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="tagsInput" type="text" class="form-input" placeholder=",," />
 </div>

 <div class="form-group full-width">
 <label></label>
 <textarea v-model="form.description" class="form-textarea" rows="4" placeholder="..."></textarea>
 </div>
 </div>

 <div class="form-actions">
 <button type="submit" class="btn btn--primary" :disabled="submitting">
 {{ submitting ? '...' : (isEdit ? '' : '') }}
 </button>
 <router-link to="/admin/companies" class="btn btn--secondary"></router-link>
 </div>
 </form>
 </div>
</template>

<script setup>
import Icon from '../../components/Icons.vue'
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
 tagsInput.value = (company.tags || []).join('')
 }
 }
})

async function handleSubmit() {
 submitting.value = true
 try {
 form.value.tags = tagsInput.value.split(/[,]/).filter(t => t.trim()).map(t => t.trim())

 if (isEdit.value) {
 await companiesStore.update(form.value.id, form.value)
 } else {
 await companiesStore.add(form.value)
 }
 router.push('/admin/companies')
 } catch (error) {
 alert('' + error.message)
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
</style>
