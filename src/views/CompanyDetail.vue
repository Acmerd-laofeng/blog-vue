<template>
  <div class="company-detail" v-if="company">
    <div class="company-detail__header">
      <div class="company-detail__back">
        <router-link to="/companies">← 返回列表</router-link>
      </div>
      <div class="company-detail__info">
        <div class="company-detail__avatar">{{ company.name.charAt(0) }}</div>
        <div>
          <h1 class="company-detail__name">{{ company.name }}</h1>
          
          <!-- 互动按钮组 (登录后可见) -->
          <div class="interaction-bar" v-if="authStore.user">
            <button class="interact-btn" :class="{ active: isLiked }" @click="toggleLike">
              <span class="icon">{{ isLiked ? '❤️' : '🤍' }}</span> 点赞
            </button>
            <button class="interact-btn" :class="{ active: isFavorited }" @click="toggleFavorite">
              <span class="icon">{{ isFavorited ? '⭐' : '☆' }}</span> 收藏
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
        <h3>📋 基本信息</h3>
        <div class="detail-row">
          <span class="detail-label">所在城市</span>
          <span class="detail-value">{{ company.province }} · {{ company.city }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">所属行业</span>
          <span class="detail-value">{{ company.industry }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">公司规模</span>
          <span class="detail-value">{{ company.size }} 人</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">工作时间</span>
          <span class="badge" :class="scheduleClass(company.schedule)">{{ company.schedule }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">薪资范围</span>
          <span class="detail-value detail-value--highlight">{{ company.salary }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">综合评分</span>
          <span class="detail-value">⭐ {{ company.rating }} / 5.0</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">收录时间</span>
          <span class="detail-value">{{ company.createdAt }}</span>
        </div>
      </div>

      <div class="detail-card">
        <h3>📝 企业简介</h3>
        <p class="company-detail__desc">{{ company.description }}</p>
        <div v-if="company.website" class="detail-row">
          <span class="detail-label">官方网站</span>
          <a :href="company.website" target="_blank" class="detail-value detail-link">{{ company.website }}</a>
        </div>
      </div>

      <!-- 地图展示 -->
      <div class="detail-card full-width">
        <h3>📍 位置分布</h3>
        <div class="map-placeholder">
          <p>🗺️ 地图加载中... ({{ company.city }})</p>
          <!-- 实际项目中这里可以嵌入高德/百度地图 iframe -->
          <div class="map-box">🗺️ Map View</div>
        </div>
      </div>
    </div>

    <!-- 员工评价区 -->
    <div class="comments-section">
      <h3>💬 员工真实评价 ({{ comments.length }})</h3>
      
      <!-- 发表评论 -->
      <div v-if="authStore.user" class="comment-form">
        <textarea v-model="newComment" placeholder="分享你在该公司的体验（薪资、加班、氛围...）" rows="3"></textarea>
        <div class="form-actions">
          <div class="rating-input">
            评分：<select v-model="newRating">
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>
          <button @click="submitComment" :disabled="submitting">{{ submitting ? '提交中...' : '发表评价' }}</button>
        </div>
      </div>
      <div v-else class="login-hint">
        <router-link to="/login">登录</router-link> 后可以发表评价
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-user">{{ comment.user_email || '匿名用户' }}</span>
            <span class="comment-rating">⭐ {{ comment.rating }}</span>
            <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
        <div v-if="comments.length === 0" class="empty-tip">暂无评价，快来抢沙发！</div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>企业不存在</h2>
    <p>该企业可能已被删除</p>
    <router-link to="/companies">返回企业列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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

// 评论相关
const comments = ref([])
const newComment = ref('')
const newRating = ref(5)
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
  if (!authStore.user) return alert('请先登录')
  if (!newComment.value.trim()) return alert('内容不能为空')

  submitting.value = true
  try {
    const { error } = await supabase
      .from('company_comments')
      .insert({
        company_id: company.value.id,
        content: newComment.value,
        rating: parseInt(newRating.value),
        user_id: authStore.user.id,
        user_email: authStore.user.email // 存个邮箱方便显示
      })
    if (error) throw error
    newComment.value = ''
    await loadComments()
  } catch(e) {
    alert('评论失败：' + e.message)
  } finally {
    submitting.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 检查互动状态
async function checkStatus() {
  if (!authStore.user || !company.value) return
  try {
    isLiked.value = await interactionService.checkLike('company', company.value.id, authStore.user.id)
    isFavorited.value = await interactionService.checkFavorite('company', company.value.id, authStore.user.id)
  } catch (e) { console.error(e) }
}

// 切换点赞
async function toggleLike() {
  try {
    isLiked.value = await interactionService.toggleLike('company', company.value.id, authStore.user.id, isLiked.value)
  } catch (e) { alert(e.message) }
}

// 切换收藏
async function toggleFavorite() {
  try {
    isFavorited.value = await interactionService.toggleFavorite('company', company.value.id, authStore.user.id, isFavorited.value)
  } catch (e) { alert(e.message) }
}

onMounted(async () => {
  await checkStatus()
  await loadComments()
  // 动态 SEO 标题
  updateSEO()
})

// 动态更新 SEO 元数据
function updateSEO() {
  if (!company.value) return
  
  const title = `${company.value.name} - 真实评价 | Acmerd`
  const desc = `${company.value.description?.substring(0, 100) || '查看企业真实评价'} - Acmerd 企业信息收录平台`
  
  document.title = title
  
  let metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.setAttribute('content', desc)
  
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', title)
  
  let ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', desc)
}

function scheduleClass(schedule) {
  if (schedule === '双休') return 'badge--green'
  if (schedule === '单休') return 'badge--red'
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
</style>
