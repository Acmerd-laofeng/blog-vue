<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 左侧：个人信息卡片 -->
      <div class="profile-card">
        <div class="avatar-large">
          {{ (nickname || authStore.user?.email || 'U').charAt(0).toUpperCase() }}
        </div>
        
        <h2>基本资料</h2>
        <div class="form-group">
          <label>昵称</label>
          <div class="input-row">
            <input 
              v-model="nickname" 
              type="text" 
              class="input-editable"
              :disabled="isEditingNick"
            />
            <button @click="toggleEditNick" class="btn-small" v-if="!isEditingNick">修改</button>
          </div>
        </div>

        <div class="form-group">
          <label>绑定邮箱</label>
          <input :value="authStore.user?.email" disabled class="input-disabled" />
        </div>

        <div class="divider"></div>

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
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h3>修改密码</h3>
        <div class="form-group">
          <label>新密码</label>
          <input v-model="newPassword" type="password" placeholder="至少 6 位" />
        </div>
        <div class="modal-actions">
          <button @click="showPasswordModal = false" class="btn-cancel">取消</button>
          <button @click="updatePassword" class="btn-primary">确认修改</button>
        </div>
        <p v-if="passwordMsg" :class="['msg', passwordError ? 'error' : 'success']">{{ passwordMsg }}</p>
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
const isEditingNick = ref(false)
const loading = ref(true)
const activeTab = ref('articles')
const favorites = ref({ articles: [], companies: [] })

const showPasswordModal = ref(false)
const newPassword = ref('')
const passwordMsg = ref('')
const passwordError = ref(false)

onMounted(async () => {
  if (authStore.user) {
    nickname.value = authStore.user.user_metadata?.username || ''
    loadFavorites()
  }
})

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
  // 简单判断是文章还是企业
  if (item.title) router.push(`/article/${item.id}`)
  else router.push(`/company/${item.id}`) // 注意：这里假设企业表也有 id，如果没有需调整
}

// 取消收藏
async function unfavoriteItem(item) {
  try {
    // 复用之前的逻辑，这里简单处理，实际应调用 service
    const type = item.title ? 'article' : 'company'
    await interactionService.toggleFavorite(type, item.id, authStore.user.id, true)
    loadFavorites()
  } catch(e) {}
}

// 昵称逻辑
function toggleEditNick() { isEditingNick.value = true }

async function saveNickname() {
  try {
    const { error } = await supabase.auth.updateUser({ data: { username: nickname.value } })
    if (error) throw error
    isEditingNick.value = false
    alert('昵称修改成功')
  } catch (e) {
    alert('修改失败')
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
/* 样式略，使用 Apple 风格 */
.profile-page {
  padding: 40px 20px;
  background: #f5f5f7;
  min-height: 100vh;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

.profile-card, .favorites-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: #2C54FB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 24px;
}

h2 { margin: 0 0 16px 0; font-size: 1.2rem; }
h3 { margin: 0 0 12px 0; font-size: 1rem; color: #666; }

.form-group { margin-bottom: 20px; }
label { display: block; font-size: 0.8rem; color: #86868b; margin-bottom: 6px; }
input { width: 100%; padding: 10px; background: #f5f5f7; border: 1px solid #d2d2d7; border-radius: 8px; }
.input-disabled { color: #666; cursor: not-allowed; }
.input-row { display: flex; gap: 8px; }

.btn-primary { background: #2C54FB; color: white; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; }
.btn-small { background: #eee; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.btn-link { background: none; border: none; color: #2C54FB; cursor: pointer; text-align: left; }
.divider { border-top: 1px solid #eee; margin: 24px 0; }

/* Tabs */
.tabs { display: flex; gap: 12px; margin-bottom: 16px; }
.tab { padding: 6px 12px; border-radius: 6px; background: #eee; border: none; cursor: pointer; }
.tab.active { background: #2C54FB; color: white; }

.item-card { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
.item-content h4 { margin: 0 0 4px; cursor: pointer; }
.item-content p { margin: 0; font-size: 0.85rem; color: #666; }
.btn-unfav { color: #ff3b30; border: none; background: none; cursor: pointer; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: 32px; border-radius: 16px; width: 400px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: #eee; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
.msg { margin-top: 12px; font-size: 0.8rem; }
.error { color: #ff3b30; }
.success { color: #34c759; }

@media (max-width: 768px) {
  .profile-container { grid-template-columns: 1fr; }
}
</style>
