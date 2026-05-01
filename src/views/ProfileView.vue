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
            <button @click="toggleEditNick" class="btn-small" v-if="!isEditingNick">修改</button>
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

        <div class="divider"></div>

        <!-- 账号安全 -->
        <h3>账号安全</h3>
        <div class="form-group">
          <label>修改密码</label>
          <button @click="showPasswordModal = true" class="btn-link">点击修改密码 &rarr;</button>
        </div>

        <button @click="saveNickname" class="btn-primary" v-if="isEditingNick">保存昵称</button>
      </div>

      <!-- 右侧：我的收藏 -->
      <div class="favorites-section">
        <h2>⭐ 我的收藏</h2>
        <div class="tabs">
          <button :class="['tab', activeTab === 'articles' ? 'active' : '']" @click="activeTab = 'articles'">文章</button>
          <button :class="['tab', activeTab === 'companies' ? 'active' : '']" @click="activeTab = 'companies'">企业</button>
        </div>

        <div class="list-container">
          <div v-if="loading" class="loading">加载中...</div>
          
          <div v-else-if="favorites[activeTab].length === 0" class="empty-tip">
            还没有收藏任何{{ activeTab === 'articles' ? '文章' : '企业' }}
          </div>

          <div v-else class="item-list">
            <div v-for="item in favorites[activeTab]" :key="item.id" class="item-card">
              <div class="item-content" @click="goToItem(item)">
                <h4>{{ item.title || item.name }}</h4>
                <p>{{ item.summary || item.city }}</p>
              </div>
              <button @click="unfavoriteItem(item)" class="btn-unfav">取消收藏</button>
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
        <!-- 头像预览 -->
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

const router = useRouter()
const authStore = useAuthStore()

const nickname = ref('')
const uid = ref('')
const avatarUrl = ref('')
const isEditingNick = ref(false)
const loading = ref(true)
const activeTab = ref('articles')
const favorites = ref({ articles: [], companies: [] })

const showPasswordModal = ref(false)
const newPassword = ref('')
const passwordMsg = ref('')
const passwordError = ref(false)

const showAvatarModal = ref(false)
const newAvatarUrl = ref('')

// 用户资料
const userProfile = ref(null)
const nicknameChangesLeft = ref(3)

onMounted(async () => {
  if (authStore.user) {
    nickname.value = authStore.user.user_metadata?.username || ''
    await loadUserProfile()
    loadFavorites()
  }
})

// 加载用户资料
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

// 加载收藏
async function loadFavorites() {
  loading.value = true
  try {
    favorites.value = await interactionService.getMyFavorites(authStore.user.id)
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}

// 跳转
function goToItem(item) {
  if (item.title) router.push(`/article/${item.id}`)
  else router.push(`/company/${item.id}`)
}

// 取消收藏
async function unfavoriteItem(item) {
  try {
    const type = item.title ? 'article' : 'company'
    await interactionService.toggleFavorite(type, item.id, authStore.user.id, true)
    loadFavorites()
  } catch(e) {}
}

// 复制 UID
function copyUid() {
  navigator.clipboard.writeText(userProfile.value.uid)
  alert('UID 已复制到剪贴板！')
}

// 昵称逻辑
function toggleEditNick() {
  if (nicknameChangesLeft.value <= 0 && !authStore.isAdmin) {
    alert('本月昵称修改次数已用完！')
    return
  }
  isEditingNick.value = true
}

async function saveNickname() {
  if (!nickname.value.trim()) {
    alert('昵称不能为空！')
    return
  }
  
  try {
    // 更新 Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({ 
      data: { username: nickname.value } 
    })
    if (authError) throw authError
    
    // 更新 profiles 表
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

// 保存头像
async function saveAvatar() {
  if (!newAvatarUrl.value.trim()) {
    alert('请输入头像 URL！')
    return
  }
  
  // 简单验证 URL
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

// 修改密码
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
</script>

<style scoped>
.profile-page {
  padding: 40px 20px;
  background: var(--bg-primary);
  min-height: 100vh;
  transition: background 0.3s;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.profile-card, .favorites-section {
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

h2 { margin: 0 0 16px 0; font-size: 1.2rem; color: var(--text-primary); }
h3 { margin: 0 0 12px 0; font-size: 1rem; color: var(--text-secondary); }

.form-group { margin-bottom: 20px; }
label { display: block; font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 6px; }
input { width: 100%; padding: 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); }
.input-disabled { color: var(--text-secondary); cursor: not-allowed; }
.input-row { display: flex; gap: 8px; }

.btn-primary { background: var(--accent); color: white; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; width: 100%; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-small { background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; cursor: pointer; color: var(--text-primary); }
.btn-link { background: none; border: none; color: var(--accent); cursor: pointer; text-align: left; }
.divider { border-top: 1px solid var(--border-light); margin: 24px 0; }

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
.tabs { display: flex; gap: 12px; margin-bottom: 16px; }
.tab { padding: 6px 12px; border-radius: 6px; background: var(--bg-input); border: none; cursor: pointer; color: var(--text-primary); }
.tab.active { background: var(--accent); color: white; }

.item-card { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--border-light); }
.item-content h4 { margin: 0 0 4px; cursor: pointer; color: var(--text-primary); }
.item-content p { margin: 0; font-size: 0.85rem; color: var(--text-secondary); }
.btn-unfav { color: var(--error); border: none; background: none; cursor: pointer; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: var(--bg-secondary); padding: 32px; border-radius: 16px; width: 400px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: var(--bg-input); border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; color: var(--text-primary); }
.msg { margin-top: 12px; font-size: 0.8rem; }
.error { color: var(--error); }
.success { color: var(--success); }

/* 头像预览 */
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
}
</style>
