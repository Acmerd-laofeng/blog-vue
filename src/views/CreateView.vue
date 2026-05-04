<template>
 <div class="create-page">
 <div class="create-header">
 <h1><Icon name="edit" /> </h1>
 <p></p>
 </div>

 <!-- -->
 <div v-if="!authStore.user" class="login-hint">
 <Icon name="user" class="hint-icon" />
 <h3></h3>
 <p></p>
 <router-link to="/login" class="btn-login"></router-link>
 </div>

 <!-- -->
 <form v-else @submit.prevent="handleSubmit" class="create-form">
 <div class="form-card">
 <div class="form-group full-width">
 <label> URL</label>
 <input v-model="form.cover_url" type="url" class="form-input" placeholder="https://... 1464×915" />
 <div v-if="form.cover_url" class="cover-preview">
 <img :src="form.cover_url" alt="" />
 </div>
 </div>

 <div class="form-group full-width">
 <label> *</label>
 <input v-model="form.title" type="text" class="form-input" required placeholder="" maxlength="100" />
 <span class="char-count">{{ form.title.length }}/100</span>
 </div>

 <div class="form-row">
 <div class="form-group">
 <label></label>
 <input v-model="form.date" type="date" class="form-input" />
 </div>

 <div class="form-group">
 <label></label>
 <input v-model="form.category" type="text" class="form-input" placeholder="" />
 </div>
 </div>

 <div class="form-group full-width">
 <label></label>
 <textarea v-model="form.summary" class="form-textarea" rows="3" placeholder="" maxlength="200"></textarea>
 <span class="char-count">{{ form.summary.length }}/200</span>
 </div>

 <div class="form-group full-width">
 <label> *</label>
 <RichTextEditor v-model="form.content" />
 </div>
 </div>

 <div class="form-actions">
 <div class="form-hint">
 <Icon name="file" class="hint-icon-small" />

 </div>
 <div class="action-buttons">
 <router-link to="/" class="btn btn--secondary"></router-link>
 <button type="submit" class="btn btn--primary" :disabled="submitting || !canSubmit">
 {{ submitting ? '...' : '' }}
 </button>
 </div>
 </div>
 </form>
 </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { articleService } from '../services/articleService'
import RichTextEditor from '../components/RichTextEditor.vue'
import Icon from '../components/Icons.vue'

const router = useRouter()
const authStore = useAuthStore()
const submitting = ref(false)

const form = ref({
 title: '',
 date: new Date().toISOString().split('T')[0],
 category: '',
 summary: '',
 content: '',
 cover_url: ''
})

const canSubmit = computed(() => {
 return form.value.title.trim() && form.value.content.trim()
})

async function handleSubmit() {
 if (!authStore.user) {
 router.push('/login')
 return
 }

 submitting.value = true
 try {
 await articleService.create({
 ...form.value,
 user_id: authStore.user.id
 })
 alert('')
 router.push('/articles')
 } catch (error) {
 alert('' + error.message)
 } finally {
 submitting.value = false
 }
}

onMounted(() => {
 if (!authStore.user) {
 // 
 }
})
</script>

<style scoped>
.create-page {
 max-width: 900px;
 margin: 0 auto;
 padding: 32px 20px;
}

.create-header {
 text-align: center;
 margin-bottom: 32px;
}

.create-header h1 {
 font-size: 2rem;
 color: #333;
 margin-bottom: 8px;
}

.create-header p {
 color: #666;
 font-size: 1rem;
}

/* */
.login-hint {
 text-align: center;
 padding: 60px 20px;
 background: white;
 border-radius: 16px;
 box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.hint-icon {
 width: 4rem;
 height: 4rem;
 color: #ccc;
 margin-bottom: 16px;
}

.login-hint h3 {
 font-size: 1.3rem;
 color: #333;
 margin-bottom: 8px;
}

.login-hint p {
 color: #666;
 margin-bottom: 24px;
}

.btn-login {
 display: inline-block;
 padding: 10px 24px;
 background: var(--accent);
 color: white;
 border-radius: 8px;
 text-decoration: none;
 font-weight: 600;
}

/* */
.create-form {
 display: flex;
 flex-direction: column;
 gap: 24px;
}

.form-card {
 background: white;
 border-radius: 16px;
 padding: 24px;
 box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.form-row {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 16px;
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

.full-width {
 grid-column: 1 / -1;
}

.form-input, .form-textarea {
 padding: 10px 14px;
 border: 2px solid #eee;
 border-radius: 8px;
 font-size: 0.95rem;
 transition: border-color 0.2s;
 width: 100%;
 box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
 outline: none;
 border-color: #2C54FB;
}

.form-textarea {
 resize: vertical;
 font-family: inherit;
}

.char-count {
 font-size: 0.8rem;
 color: #999;
 text-align: right;
}

.cover-preview {
 margin-top: 12px;
 border-radius: 8px;
 overflow: hidden;
}

.cover-preview img {
 width: 100%;
 max-height: 200px;
 object-fit: cover;
}

/* */
.form-actions {
 display: flex;
 justify-content: space-between;
 align-items: center;
 flex-wrap: wrap;
 gap: 16px;
}

.form-hint {
 display: flex;
 align-items: center;
 gap: 8px;
 color: #666;
 font-size: 0.85rem;
}

.hint-icon-small {
 width: 1rem;
 height: 1rem;
 color: #999;
}

.action-buttons {
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
 transition: all 0.2s;
}

.btn--primary {
 background: linear-gradient(135deg, #2C54FB, #2C54FB);
 color: white;
}

.btn--primary:hover:not(:disabled) {
 background: linear-gradient(135deg, #1A42E6, #1A42E6);
}

.btn--primary:disabled {
 opacity: 0.5;
 cursor: not-allowed;
}

.btn--secondary {
 background: #f0f0f0;
 color: #666;
}

.btn--secondary:hover {
 background: #e0e0e0;
}

@media (max-width: 600px) {
 .form-row {
 grid-template-columns: 1fr;
 }

 .form-actions {
 flex-direction: column;
 }

 .action-buttons {
 width: 100%;
 }

 .action-buttons .btn {
 flex: 1;
 text-align: center;
 }
}
</style>
