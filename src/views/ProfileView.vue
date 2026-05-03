<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 左侧：个人信息卡片 -->
      <div class="profile-card">
        <!-- 头像 -->
        <div class="avatar-section">
          <div class="avatar-large">
            <img v-if="avatarUrl" :src="avatarUrl" alt="头像" />
            <span v-else>{{ (nickname || authStore.user?.email || 'U').charAt(0).toUpperCase() }}</span>
          </div>
          <button @click="showAvatarModal = true" class="btn-change-avatar">更换头像</button>
        </div>
        
        <h2>基本资料</h2>
        
        <!-- UID (只读) -->
        <div class="form-group">
          <label>UID (唯一标识)</label>
          <div class="uid-display">
            <span class="uid-text">{{ userProfile?.uid || '加载中...' }}</span>
            <button @click="copyUid" class="btn-copy" v-if="userProfile?.uid">复制</button>
          </div>
        </div>

        <!-- 昵称 -->
        <div class="form-group">
          <label>昵称</label>
          <div class="input-row">
            <input 
              v-model="nickname" 
              type="text" 
              class="input-editable"
              :disabled="!isEditingNick"
              placeholder="输入新昵称"
            />
            <button @click="isEditingNick ? saveNickname() : toggleEditNick()" class="btn-small" :class="{ 'btn-save': isEditingNick }">
              {{ isEditingNick ? '保存' : '修改' }}
            </button>
          </div>
          <div class="nick-hint">
            剩余修改次数：<strong :class="{ warning: nicknameChangesLeft <= 1 }">{{ nicknameChangesLeft }}</strong> / 3 次
            <span v-if="authStore.isAdmin" class="admin-badge">管理员无限次</span>
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label>绑定邮箱</label>
          <input :value="authStore.user?.email" disabled class="input-disabled" />
        </div>

        <!-- 用户数据统计 -->
        <div class="user-stats">
          <div class="stat-item">
            <Icon name="article" class="stat-icon" />
            <span class="stat-num">{{ stats.articles }}</span>
            <span class="stat-label">我的文章</span>
          </div>
          <div class="stat-item">
            <Icon name="comment" class="stat-icon" />
            <span class="stat-num">{{ stats.comments }}</span>
            <span class="stat-label">我的评论</span>
          </div>
          <div class="stat-item">
            <Icon name="image" class="stat-icon" />
            <span class="stat-num">{{ stats.favorites }}</span>
            <span class="stat-label">我的收藏</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- 账号安全 -->
        <h3>账号安全</h3>
        <div class="form-group">
          <label>修改密码</label>
          <button @click="showPasswordModal = true" class="btn-link">点击修改密码 &rarr;</button>
        </div>

      </div>

      <!-- 右侧：内容区域 -->
      <div class="content-section">
        <h2><Icon name="folder" class="title-icon" /> 我的内容</h2>
        <div class="tabs">
          <button :class="['tab', activeTab === 'articles' ? 'active' : '']" @click="activeTab = 'articles'">
            <Icon name="article" class="tab-icon" /> 我的文章
          </button>
          <button :class="['tab', activeTab === 'comments' ? 'active' : '']" @click="activeTab = 'comments'">
            <Icon name="comment" class="tab-icon" /> 我的评论
          </button>
          <button :class="['tab', activeTab === 'favorites' ? 'active' : '']" @click="activeTab = 'favorites'">
            <Icon name="image" class="tab-icon" /> 我的收藏
          </button>
        </div>

        <div class="list-container">
          <div v-if="loading" class="loading">
            <Icon name="refresh" class="loading-icon" /> 加载中...
          </div>
          
          <!-- 我的文章 -->
          <div v-else-if="activeTab === 'articles'" class="tab-content">
            <div v-if="myArticles.length === 0" class="empty-tip">
              <Icon name="inbox" class="empty-icon" />
              <p>还没有发布任何文章</p>
              <router-link to="/admin/articles/new" class="btn-create">去写文章</router-link>
            </div>
            <div v-else class="item-list">
              <div v-for="item in myArticles" :key="item.id" class="item-card" @click="$router.push(`/article/${item.id}`)">
                <div class="item-cover">
                  <img v-if="item.cover_url" :src="item.cover_url" :alt="item.title" />
                  <div v-else class="cover-placeholder"><Icon name="article" /></div>
                </div>
                <div class="item-info">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.summary || '暂无摘要' }}</p>
                  <div class="item-meta">
                    <span>{{ item.date }}</span>
                    <span><Icon name="eye" class="meta-icon" /> {{ item.view_count || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的评论 -->
          <div v-else-if="activeTab === 'comments'" class="tab-content">
            <div v-if="myComments.length === 0" class="empty-tip">
              <Icon name="inbox" class="empty-icon" />
              <p>还没有发表过评论</p>
            </div>
            <div v-else class="comment-list">
              <div v-for="c in myComments" :key="c.id" class="comment-card" @click="$router.push(`/article/${c.article_id}`)">
                <div class="comment-header">
                  <span class="comment-target">📝 {{ c.article_title || '文章' }}</span>
                  <span class="comment-date">{{ formatDate(c.created_at) }}</span>
                </div>
                <p class="comment-content">{{ c.content }}</p>
              </div>
            </div>
          </div>

          <!-- 我的收藏 -->
          <div v-else-if="activeTab === 'favorites'" class="tab-content">
            <div class="sub-tabs">
              <button :class="['sub-tab', favTab === 'articles' ? 'active' : '']" @click="favTab = 'articles'">文章</button>
              <button :class="['sub-tab', favTab === 'companies' ? 'active' : '']" @click="favTab = 'companies'">企业</button>
              <button :class="['sub-tab', favTab === 'works' ? 'active' : '']" @click="favTab = 'works'">作品</button>
            </div>
            
            <div v-if="favorites[favTab].length === 0" class="empty-tip">
              <Icon name="inbox" class="empty-icon" />
              <p>还没有收藏任何{{ favTab === 'articles' ? '文章' : favTab === 'companies' ? '企业' : '作品' }}</p>
            </div>
            <div v-else class="item-list">
              <div v-for="item in favorites[favTab]" :key="item.id" class="item-card" @click="goToItem(item)">
                <div class="item-cover" v-if="item.cover_url || item.image_url">
                  <img :src="item.cover_url || item.image_url" :alt="item.title || item.name" />
                </div>
                <div class="item-info">
                  <h4>{{ item.title || item.name }}</h4>
                  <p>{{ item.summary || item.city || item.description || '' }}</p>
                </div>
                <button @click.stop="unfavoriteItem(item)" class="btn-unfav"><Icon name="x" class="unfav-icon" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content">
        <h3>修改密码</h3>
        <div class="form-group">
          <label>新密码</label>
          <input v-model="newPassword" type="password" placeholder="至少 6 位，字母 + 数字/符号" />
        </div>
        <div class="modal-actions">
          <button @click="showPasswordModal = false" class="btn-cancel">取消</button>
          <button @click="updatePassword" class="btn-primary">确认修改</button>
        </div>
        <p v-if="passwordMsg" :class="['msg', passwordError ? 'error' : 'success']">{{ passwordMsg }}</p>
      </div>
    </div>

    <!-- 更换头像弹窗 -->
    <div v-if="showAvatarModal" class="modal-overlay" @click.self="showAvatarModal = false">
      <div class="modal-content">
        <h3>更换头像</h3>
        <div class="form-group">
          <label>头像 URL</label>
          <input v-model="newAvatarUrl" type="text" placeholder="粘贴图片链接 (https://...)" />
          <p class="avatar-hint">支持 JPG/PNG/GIF 格式，建议尺寸 200x200</p>
        </div>
        <div class="avatar-preview">
          <div class="avatar-preview-circle">
            <img v-if="newAvatarUrl || avatarUrl" :src="newAvatarUrl || avatarUrl" alt="预览" />
            <span v-else>{{ nickname.charAt(0) || 'U' }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showAvatarModal = false" class="btn-cancel">取消</button>
          <button @click="saveAvatar" class="btn-primary">保存头像</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import { interactionService } from '../services/interactionService'
import Icon from '../components/Icons.vue'

const router = useRouter()
const authStore = useAuthStore()

const nickname = ref('')
const uid = ref('')
const avatarUrl = ref('')
const isEditingNick = ref(false)
const loading = ref(true)
const activeTab = ref('articles')
const favTab = ref('articles')
const favorites = ref({ articles: [], companies: [], works: [] })
const myArticles = ref([])
const myComments = ref([])

const showPasswordModal = ref(false)
const newPassword = ref('')
const passwordMsg = ref('')
const passwordError = ref(false)

const showAvatarModal = ref(false)
const newAvatarUrl = ref('')

const userProfile = ref(null)
const nicknameChangesLeft = ref(3)

const stats = ref({ articles: 0, comments: 0, favorites: 0 })

onMounted(async () => {
  if (authStore.user) {
    nickname.value = authStore.user.user_metadata?.username || ''
    await loadUserProfile()
    loadUserStats()
    loadFavorites()
  }
})

async function loadUserProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('uid, avatar_url, nickname_changes_left')
    .eq('id', authStore.user.id)
    .single()
  
  if (error) {
    console.error('Failed to load profile:', error)
    return
  }
  
  userProfile.value = data
  uid.value = data.uid
  avatarUrl.value = data.avatar_url || ''
  nicknameChangesLeft.value = data.nickname_changes_left || 3
}

async function loadUserStats() {
  loading.value = true
  
  // 1. 我的文章数
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('user_id', authStore.user.id)
    .order('created_at', { ascending: false })
  
  myArticles.value = articles || []
  stats.value.articles = myArticles.value.length
  
  // 2. 我的评论数
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('user_id', authStore.user.id)
    .order('created_at', { ascending: false })
  
  myComments.value = comments || []
  stats.value.comments = myComments.value.length
  
  loading.value = false
}

async function loadFavorites() {
  try {
    const favs = await interactionService.getMyFavorites(authStore.user.id)
    favorites.value = favs
    stats.value.favorites = (favs.articles?.length || 0) + (favs.companies?.length || 0) + (favs.works?.length || 0)
  } catch (e) {
    console.error(e)
  }
}

function goToItem(item) {
  if (item.title) router.push(`/article/${item.id}`)
  else if (item.image_url) router.push(`/works`)
  else router.push(`/company/${item.id}`)
}

async function unfavoriteItem(item) {
  try {
    const type = item.image_url ? 'work' : (item.title ? 'article' : 'company')
    await interactionService.toggleFavorite(type, item.id, authStore.user.id, true)
    loadFavorites()
  } catch(e) {}
}

function copyUid() {
  navigator.clipboard.writeText(userProfile.value.uid)
  alert('UID 已复制到剪贴板！')
}

function toggleEditNick() {
  if (nicknameChangesLeft.value <= 0 && !authStore.isAdmin) {
    alert('本月昵称修改次数已用完！')
    return
  }
  if (confirm('确定要修改昵称吗？\n\n当前昵称：' + (nickname.value || '无') + '\n\n修改后剩余次数：' + (nicknameChangesLeft.value - 1) + ' 次')) {
    isEditingNick.value = true
  }
}

async function saveNickname() {
  if (!nickname.value.trim()) {
    alert('昵称不能为空！')
    return
  }
  
  try {
    const { error: authError } = await supabase.auth.updateUser({ 
      data: { username: nickname.value } 
    })
    if (authError) throw authError
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nickname_changes_left: nicknameChangesLeft.value - 1,
        last_nickname_change: new Date().toISOString()
      })
      .eq('id', authStore.user.id)
    
    if (profileError) throw profileError
    
    isEditingNick.value = false
    nicknameChangesLeft.value--
    alert('昵称修改成功！')
  } catch (e) {
    alert('修改失败：' + e.message)
  }
}

async function saveAvatar() {
  if (!newAvatarUrl.value.trim()) {
    alert('请输入头像 URL！')
    return
  }
  
  if (!newAvatarUrl.value.startsWith('http')) {
    alert('请输入有效的图片链接！')
    return
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatarUrl.value })
      .eq('id', authStore.user.id)
    
    if (error) throw error
    
    avatarUrl.value = newAvatarUrl.value
    showAvatarModal.value = false
    newAvatarUrl.value = ''
    alert('头像更新成功！')
  } catch (e) {
    alert('头像更新失败：' + e.message)
  }
}

async function updatePassword() {
  passwordMsg.value = ''
  if (newPassword.value.length < 6) {
    passwordMsg.value = '密码太短'
    passwordError.value = true
    return
  }
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) throw error
    passwordMsg.value = '修改成功，请重新登录'
    passwordError.value = false
    setTimeout(() => {
      authStore.logout()
      router.push('/login')
    }, 1500)
  } catch (e) {
    passwordMsg.value = e.message
    passwordError.value = true
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>

<style scoped>
.profile-page {
  padding: 40px 20px;
  background: var(--bg-primary);
  min-height: 100vh;
  transition: background 0.3s;
}

.profile-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.profile-card, .content-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow);
  transition: background 0.3s, box-shadow 0.3s;
}

/* 头像区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-large {
  width: 100px;
  height: 100px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 12px;
  overflow: hidden;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-change-avatar {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--accent);
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-change-avatar:hover {
  background: var(--accent-light);
}

/* UID 显示 */
.uid-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  padding: 10px;
  border-radius: 8px;
}

.uid-text {
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-secondary);
  word-break: break-all;
}

.btn-copy {
  background: var(--accent);
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  white-space: nowrap;
}

.btn-copy:hover {
  background: var(--accent-hover);
}

h2 { 
  margin: 0 0 16px 0; 
  font-size: 1.2rem; 
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 1.2rem;
  height: 1.2rem;
}

h3 { margin: 0 0 12px 0; font-size: 1rem; color: var(--text-secondary); }

.form-group { margin-bottom: 20px; }
label { display: block; font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 6px; }
input { width: 100%; padding: 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); }
.input-disabled { color: var(--text-secondary); cursor: not-allowed; }
.input-row { display: flex; gap: 8px; }

.btn-primary { background: var(--accent); color: white; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; width: 100%; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-small { background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; cursor: pointer; color: var(--text-primary); white-space: nowrap; }
.btn-save { background: var(--accent) !important; color: white !important; border-color: var(--accent) !important; }
.btn-link { background: none; border: none; color: var(--accent); cursor: pointer; text-align: left; }
.divider { border-top: 1px solid var(--border-light); margin: 24px 0; }

/* 用户数据统计 */
.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--accent);
}

.stat-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* 昵称提示 */
.nick-hint {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.nick-hint .warning {
  color: var(--error);
}

.admin-badge {
  margin-left: 8px;
  background: var(--accent-light);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Tabs */
.tabs { 
  display: flex; 
  gap: 12px; 
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab { 
  padding: 8px 16px;
  border-radius: 8px; 
  background: var(--bg-input); 
  border: none; 
  cursor: pointer; 
  color: var(--text-primary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab.active { 
  background: var(--accent); 
  color: white; 
}

.tab-icon {
  width: 1rem;
  height: 1rem;
}

/* Sub Tabs */
.sub-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.sub-tab {
  padding: 6px 14px;
  border-radius: 6px;
  background: var(--bg-input);
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.sub-tab.active {
  background: var(--accent);
  color: white;
}

/* Item Cards */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  background: var(--bg-hover);
  transform: translateX(4px);
}

.item-cover {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  color: #ccc;
}

.cover-placeholder svg {
  width: 1.5rem;
  height: 1.5rem;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 1rem;
}

.item-info p {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.meta-icon {
  width: 0.8rem;
  height: 0.8rem;
  vertical-align: middle;
}

.btn-unfav {
  color: var(--error);
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
}

.unfav-icon {
  width: 1rem;
  height: 1rem;
}

/* Comment List */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.comment-card:hover {
  background: var(--bg-hover);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.comment-target {
  color: var(--accent);
  font-weight: 500;
}

.comment-date {
  color: var(--text-tertiary);
}

.comment-content {
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

/* Empty State */
.empty-tip {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #ccc;
  margin-bottom: 12px;
}

.btn-create {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 20px;
  background: var(--accent);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
}

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-tertiary);
}

.loading-icon {
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: var(--bg-secondary); padding: 32px; border-radius: 16px; width: 400px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: var(--bg-input); border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; color: var(--text-primary); }
.msg { margin-top: 12px; font-size: 0.8rem; }
.error { color: var(--error); }
.success { color: var(--success); }

.avatar-preview {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.avatar-preview-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--text-secondary);
  overflow: hidden;
}

.avatar-preview-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .profile-container { grid-template-columns: 1fr; }
  .modal-content { width: 90%; }
  .user-stats { grid-template-columns: repeat(3, 1fr); }
  .tabs { gap: 8px; }
  .tab { padding: 6px 12px; font-size: 0.85rem; }
}
</style>
