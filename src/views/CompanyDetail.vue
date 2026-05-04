<template>
 <div class="company-detail" v-if="company">
 <div class="company-detail__header">
 <div class="company-detail__back">
 <router-link to="/companies">← </router-link>
 </div>
 <div class="company-detail__info">
 <div class="company-detail__avatar">{{ company.name.charAt(0) }}</div>
 <div>
 <h1 class="company-detail__name">{{ company.name }}</h1>

 <!-- () -->
 <div class="interaction-bar" v-if="authStore.user">
 <button class="interact-btn" :class="{ active: isLiked }" @click="toggleLike">
 <Icon :name="isLiked ? 'heart-filled' : 'heart'" class="interact-icon" /> 
 </button>
 <button class="interact-btn" :class="{ active: isFavorited }" @click="toggleFavorite">
 <Icon :name="isFavorited ? 'bookmark-filled' : 'bookmark'" class="interact-icon" /> 
 </button>
 </div>

 <div class="company-detail__tags">
 <span v-for="tag in company.tags" :key="tag" class="tag">{{ tag }}</span>
 </div>
 </div>
 </div>
 </div>

 <div class="company-detail__grid">
 <div class="detail-card">
 <h3><Icon name="file" class="card-icon" /> </h3>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value">{{ company.province }} · {{ company.city }}</span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value">{{ company.industry }}</span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value">{{ company.size }} </span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value detail-value--highlight">{{ company.salary }}</span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value"><StarRating :score="company.rating" :count="company.review_count" /></span>
 </div>
 <div class="detail-row">
 <span class="detail-label"></span>
 <span class="detail-value">{{ company.createdAt }}</span>
 </div>
 </div>

 <div class="detail-card">
 <h3><Icon name="edit" class="card-icon" /> </h3>
 <p class="company-detail__desc">{{ company.description }}</p>
 <div v-if="company.website" class="detail-row">
 <span class="detail-label"></span>
 <a :href="company.website" target="_blank" class="detail-value detail-link">{{ company.website }}</a>
 </div>
 </div>

 <!-- -->
 <div class="detail-card full-width">
 <h3><Icon name="map-pin" class="card-icon" /> </h3>
 <div class="map-placeholder">
 <p><Icon name="map" class="map-icon" /> ... ({{ company.city }})</p>
 <!-- / iframe -->
 <div class="map-box"><Icon name="map" class="map-icon" /> Map View</div>
 </div>
 </div>
 </div>

 <!-- -->
 <div class="comments-section">
 <h3><Icon name="comment" class="card-icon" /> ({{ comments.length }})</h3>

 <!-- -->
 <div v-if="authStore.user" class="comment-form">
 <textarea v-model="newComment" placeholder="..." rows="3"></textarea>
 <div class="form-actions">
 <div class="rating-input">

 <div class="star-input" @mouseleave="hoverRating = 0">
 <span v-for="i in 5" :key="i" class="star-input__star" 
 @mouseenter="hoverRating = i" 
 @click="newRating = i"
 :class="{ active: i <= (hoverRating || newRating) }"
 ></span>
 </div>
 <span class="star-input__value">{{ newRating }} </span>
 </div>
 <button @click="submitComment" :disabled="submitting">{{ submitting ? '...' : '' }}</button>
 </div>
 </div>
 <div v-else class="login-hint">
 <router-link to="/login"></router-link> 
 </div>

 <!-- -->
 <div class="comment-list">
 <div v-for="comment in comments" :key="comment.id" class="comment-item">
 <div class="comment-header">
 <span class="comment-user">{{ comment.user_email || '' }}</span>
 <span class="comment-rating"><StarRating :score="comment.rating" /></span>
 <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
 </div>
 <p class="comment-content">{{ comment.content }}</p>
 </div>
 <div v-if="comments.length === 0" class="empty-tip"></div>
 </div>
 </div>
 </div>

 <div v-else class="not-found">
 <h2></h2>
 <p></p>
 <router-link to="/companies"></router-link>
 </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '../components/Icons.vue'
import { useCompaniesStore } from '../stores/companies'
import { useAuthStore } from '../stores/auth'
import { interactionService } from '../services/interactionService'
import { supabase } from '../lib/supabase'

const route = useRoute()
const companiesStore = useCompaniesStore()
const authStore = useAuthStore()

const company = computed(() => companiesStore.getById(Number(route.params.id)))

const isLiked = ref(false)
const isFavorited = ref(false)

// 
const comments = ref([])
const newComment = ref('')
const newRating = ref(5)
const hoverRating = ref(0)
const submitting = ref(false)

async function loadComments() {
 if (!company.value) return
 const { data, error } = await supabase
 .from('company_comments')
 .select('*')
 .eq('company_id', company.value.id)
 .order('created_at', { ascending: false })

 if (error) console.error('Failed to load comments', error)
 else comments.value = data || []
}

async function submitComment() {
 if (!authStore.user) return alert('')
 if (!newComment.value.trim()) return alert('')

 submitting.value = true
 try {
 const { error } = await supabase
 .from('company_comments')
 .insert({
 company_id: company.value.id,
 content: newComment.value,
 rating: parseInt(newRating.value),
 user_id: authStore.user.id,
 user_email: authStore.user.email // 
 })
 if (error) throw error
 newComment.value = ''
 await loadComments()
 } catch(e) {
 alert('' + e.message)
 } finally {
 submitting.value = false
 }
}

function formatDate(dateStr) {
 if (!dateStr) return ''
 return new Date(dateStr).toLocaleString('zh-CN')
}

// 
async function checkStatus() {
 if (!authStore.user || !company.value) return
 try {
 isLiked.value = await interactionService.checkLike('company', company.value.id, authStore.user.id)
 isFavorited.value = await interactionService.checkFavorite('company', company.value.id, authStore.user.id)
 } catch (e) { console.error(e) }
}

// 
async function toggleLike() {
 try {
 isLiked.value = await interactionService.toggleLike('company', company.value.id, authStore.user.id, isLiked.value)
 } catch (e) { alert(e.message) }
}

// 
async function toggleFavorite() {
 try {
 isFavorited.value = await interactionService.toggleFavorite('company', company.value.id, authStore.user.id, isFavorited.value)
 } catch (e) { alert(e.message) }
}

onMounted(async () => {
 await checkStatus()
 await loadComments()
 // SEO 
 updateSEO()
})

// SEO 
function updateSEO() {
 if (!company.value) return

 const title = `${company.value.name} - | Acmerd`
 const desc = `${company.value.description?.substring(0, 100) || ''} - Acmerd `

 document.title = title

 let metaDesc = document.querySelector('meta[name="description"]')
 if (metaDesc) metaDesc.setAttribute('content', desc)

 let ogTitle = document.querySelector('meta[property="og:title"]')
 if (ogTitle) ogTitle.setAttribute('content', title)

 let ogDesc = document.querySelector('meta[property="og:description"]')
 if (ogDesc) ogDesc.setAttribute('content', desc)
}

function scheduleClass(schedule) {
 if (schedule === '') return 'badge--green'
 if (schedule === '') return 'badge--red'
 return 'badge--orange'
}
</script>

<style scoped>
.company-detail {
 max-width: 900px;
 margin: 0 auto;
 padding: 24px 20px;
}

.company-detail__back {
 margin-bottom: 16px;
}

.company-detail__back a {
 color: #2C54FB;
 text-decoration: none;
}

.interaction-bar {
 display: flex;
 gap: 8px;
 margin-top: 8px;
}

.interact-btn {
 display: flex;
 align-items: center;
 gap: 4px;
 padding: 4px 10px;
 border: 1px solid #ddd;
 border-radius: 16px;
 background: white;
 color: #666;
 font-size: 0.8rem;
 cursor: pointer;
 transition: all 0.2s;
}

.interact-btn:hover {
 background: #f5f5f7;
}

.interact-btn.active {
 color: #2C54FB;
 border-color: #2C54FB;
 background: rgba(44, 84, 251, 0.05);
}

.interact-btn .icon {
 font-size: 0.9rem;
}

.company-detail__info {
 display: flex;
 align-items: center;
 gap: 20px;
 margin-bottom: 32px;
}

.company-detail__avatar {
 width: 72px;
 height: 72px;
 border-radius: 50%;
 background: linear-gradient(135deg, #2C54FB, #2C54FB);
 color: white;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 2rem;
 font-weight: 700;
 flex-shrink: 0;
}

.company-detail__name {
 font-size: 2rem;
 color: #333;
 margin-bottom: 8px;
}

.company-detail__tags {
 display: flex;
 flex-wrap: wrap;
 gap: 8px;
}

.company-detail__grid {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 20px;
}

@media (max-width: 768px) {
 .company-detail__grid {
 grid-template-columns: 1fr;
 }
}

.detail-card {
 background: white;
 border-radius: 12px;
 padding: 24px;
 border: 1px solid #eee;
}

.detail-card h3 {
 font-size: 1.1rem;
 color: #333;
 margin-bottom: 16px;
 padding-bottom: 8px;
 border-bottom: 2px solid #2C54FB;
}

.detail-row {
 display: flex;
 justify-content: space-between;
 padding: 12px 0;
 border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
 border-bottom: none;
}

.detail-label {
 color: #666;
 font-size: 0.9rem;
}

.detail-value {
 color: #333;
 font-weight: 500;
}

.detail-value--highlight {
 color: #2C54FB;
 font-size: 1.1rem;
}

.detail-link {
 color: #2C54FB;
 text-decoration: none;
}

.detail-link:hover {
 text-decoration: underline;
}

.company-detail__desc {
 color: #555;
 line-height: 1.8;
 margin-bottom: 16px;
}

.badge {
 padding: 4px 12px;
 border-radius: 20px;
 font-size: 0.85rem;
 font-weight: 600;
}

.badge--green { background: #e8f5e9; color: #2e7d32; }
.badge--red { background: #ffebee; color: #c62828; }
.badge--orange { background: #fff3e0; color: #e65100; }

.tag {
 padding: 2px 10px;
 background: #f0f0f0;
 border-radius: 12px;
 font-size: 0.8rem;
 color: #555;
}

.not-found {
 text-align: center;
 padding: 80px 20px;
}

.not-found h2 {
 color: #333;
 margin-bottom: 8px;
}

.not-found p {
 color: #666;
 margin-bottom: 16px;
}

.not-found a {
 color: #2C54FB;
}

/* */
.comments-section {
 margin-top: 32px;
}

.comments-section h3 {
 font-size: 1.2rem;
 color: #333;
 margin-bottom: 16px;
}

.comment-form textarea {
 width: 100%;
 padding: 12px;
 border: 1px solid #ddd;
 border-radius: 8px;
 font-size: 0.95rem;
 resize: vertical;
 font-family: inherit;
}

.form-actions {
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-top: 12px;
}

.rating-input {
 display: flex;
 align-items: center;
 gap: 8px;
}

/* */
.star-input {
 display: inline-flex;
 gap: 4px;
}

.star-input__star {
 font-size: 1.5rem;
 cursor: pointer;
 color: #E8E8E8;
 transition: color 0.15s;
 user-select: none;
}

.star-input__star.active {
 color: #FFB800;
}

.star-input__value {
 font-size: 0.9rem;
 color: #999;
 margin-left: 4px;
}

.form-actions button {
 padding: 8px 20px;
 background: #2C54FB;
 color: white;
 border: none;
 border-radius: 8px;
 font-size: 0.9rem;
 cursor: pointer;
 font-weight: 600;
}

.form-actions button:disabled {
 opacity: 0.5;
 cursor: not-allowed;
}

.login-hint {
 color: #999;
 margin-bottom: 16px;
}

.login-hint a {
 color: #2C54FB;
 font-weight: 500;
}

/* */
.comment-list {
 margin-top: 16px;
}

.comment-item {
 padding: 16px;
 background: white;
 border-radius: 8px;
 border: 1px solid #eee;
 margin-bottom: 12px;
}

.comment-header {
 display: flex;
 align-items: center;
 gap: 12px;
 margin-bottom: 8px;
}

.comment-user {
 font-weight: 500;
 color: #333;
}

.comment-rating {
 display: inline-flex;
}

.comment-date {
 font-size: 0.8rem;
 color: #999;
}

.comment-content {
 color: #555;
 font-size: 0.95rem;
 line-height: 1.6;
 margin: 0;
}

.empty-tip {
 text-align: center;
 color: #999;
 padding: 40px;
}
</style>
