<template>
 <div class="comments">
 <h3 class="comments__title"><Icon name="comment" class="title-icon" /> ({{ comments.length }})</h3>

 <!-- -->
 <div class="comments__list">
 <div v-if="comments.length === 0" class="comments__empty">
 <p></p>
 </div>
 <div v-for="comment in comments" :key="comment.id" class="comment-item">
 <div class="comment-item__header">
 <span class="comment-item__name">{{ comment.user_name }}</span>
 <span class="comment-item__date">{{ formatDate(comment.created_at) }}</span>
 </div>
 <p class="comment-item__content">{{ comment.content }}</p>
 </div>
 </div>

 <!-- -->
 <div v-if="isUserBanned" class="ban-alert">

 </div>

 <!-- () -->
 <form v-else @submit.prevent="handleSubmit" class="comment-form">
 <h4></h4>

 <!-- -->
 <div v-if="!isUserLoggedIn" class="form-group">
 <input 
 v-model="form.userName" 
 type="text" 
 placeholder="" 
 required 
 class="form-input"
 maxlength="20"
 />
 </div>

 <!-- -->
 <div v-else class="form-group logged-in-info">
 <span class="info-label"></span>
 <span class="info-value">{{ currentUserUsername }}</span>
 </div>

 <div class="form-group">
 <textarea 
 v-model="form.content" 
 placeholder="..." 
 required 
 class="form-textarea"
 rows="4"
 maxlength="500"
 ></textarea>
 </div>
 <button type="submit" class="btn btn--primary" :disabled="submitting">
 {{ submitting ? '...' : '' }}
 </button>
 </form>
 </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { commentService } from '../services/commentService'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import Icon from './Icons.vue'

const props = defineProps({
 articleId: {
 type: Number,
 required: true
 }
})

const authStore = useAuthStore()
const comments = ref([])
const submitting = ref(false)
const isUserBanned = ref(false) // 
const form = ref({
 userName: '',
 content: ''
})

const isUserLoggedIn = computed(() => !!authStore.user)
const currentUserUsername = computed(() => authStore.user?.user_metadata?.username || '')

// 
async function init() {
 prefillUsername()
 await checkBanStatus()
}

function prefillUsername() {
 if (isUserLoggedIn.value && currentUserUsername.value) {
 form.value.userName = currentUserUsername.value
 }
}

// 
async function checkBanStatus() {
 if (!authStore.user) return

 const { data, error } = await supabase
 .from('profiles')
 .select('is_banned')
 .eq('id', authStore.user.id)
 .single()

 if (error) {
 console.error('Check ban status error:', error)
 return
 }

 isUserBanned.value = !!data?.is_banned
}

async function loadComments() {
 comments.value = await commentService.getByArticle(props.articleId)
}

async function handleSubmit() {
 submitting.value = true
 try {
 await commentService.create({
 articleId: props.articleId,
 userName: form.value.userName,
 content: form.value.content
 })

 // 
 const savedName = form.value.userName
 form.value.content = ''
 form.value.userName = savedName

 // 
 await loadComments()
 alert('')
 } catch (error) {
 alert('' + error.message)
 } finally {
 submitting.value = false
 }
}

function formatDate(dateStr) {
 const date = new Date(dateStr)
 return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
 loadComments()
 init()
})
</script>

<style scoped>
.comments {
 margin-top: 48px;
 padding-top: 24px;
 border-top: 1px solid #eee;
}

.comments__title {
 font-size: 1.4rem;
 color: #333;
 margin-bottom: 24px;
}

.comments__empty {
 text-align: center;
 padding: 30px;
 background: #f9f9f9;
 border-radius: 8px;
 color: #999;
 margin-bottom: 24px;
}

.comment-item {
 padding: 16px 0;
 border-bottom: 1px solid #f0f0f0;
}

.comment-item__header {
 display: flex;
 justify-content: space-between;
 margin-bottom: 8px;
}

.comment-item__name {
 font-weight: 700;
 color: #2C54FB;
}

.comment-item__date {
 font-size: 0.8rem;
 color: #999;
}

.comment-item__content {
 color: #444;
 line-height: 1.6;
 margin: 0;
 white-space: pre-wrap;
}

.ban-alert {
 margin-top: 32px;
 padding: 20px;
 background: #fff3e0;
 border: 1px solid #ff9800;
 color: #ef6c00;
 border-radius: 8px;
 text-align: center;
 font-weight: 600;
}

.comment-form {
 margin-top: 32px;
 background: white;
 padding: 24px;
 border: 1px solid #eee;
 border-radius: 12px;
}

.comment-form h4 {
 margin: 0 0 16px 0;
 color: #333;
}

.form-group {
 margin-bottom: 16px;
}

.form-input,
.form-textarea {
 width: 100%;
 padding: 12px;
 border: 1px solid #ddd;
 border-radius: 8px;
 font-size: 0.95rem;
 outline: none;
 transition: border-color 0.2s;
 box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
 border-color: #2C54FB;
}

.form-textarea {
 resize: vertical;
 font-family: inherit;
}

.logged-in-info {
 display: flex;
 align-items: center;
 gap: 8px;
 padding: 12px;
 background: #f0f7ff;
 border-radius: 8px;
 color: #0056b3;
}

.info-label {
 font-size: 0.9rem;
 color: #555;
}

.info-value {
 font-weight: 700;
}

.btn {
 padding: 12px 24px;
 border: none;
 border-radius: 8px;
 font-size: 0.95rem;
 font-weight: 600;
 cursor: pointer;
 transition: opacity 0.2s;
}

.btn--primary {
 background: linear-gradient(135deg, #2C54FB, #2C54FB);
 color: white;
}

.btn--primary:disabled {
 opacity: 0.5;
 cursor: not-allowed;
}
</style>
