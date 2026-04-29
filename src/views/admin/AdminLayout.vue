<template>
  <div class="admin">
    <aside class="admin__sidebar">
      <div class="admin__logo">
        <h2>Acmerd</h2>
        <span>管理后台</span>
      </div>
      
      <div class="admin__user" v-if="authStore.user">
        <div class="admin__avatar">{{ authStore.user.email?.charAt(0).toUpperCase() }}</div>
        <div class="admin__userinfo">
          <div class="admin__email">{{ authStore.user.email }}</div>
          <div class="admin__role">管理员</div>
        </div>
      </div>

      <nav class="admin__nav">
        <router-link to="/admin/dashboard" class="admin__link">📊 仪表盘</router-link>
        <router-link to="/admin/companies" class="admin__link">🏢 企业管理</router-link>
        <router-link to="/admin/articles" class="admin__link">📝 文章管理</router-link>
        <router-link to="/admin/banners" class="admin__link">🎠 轮播图管理</router-link>
      </nav>
      
      <div class="admin__footer">
        <button @click="handleLogout" class="btn-logout">退出登录</button>
      </div>
    </aside>
    
    <main class="admin__content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.signOut()
  router.push('/login')
}
</script>

<style scoped>
.admin {
  display: flex;
  min-height: 100vh;
}

.admin__sidebar {
  width: 240px;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.admin__logo {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin__logo h2 {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.admin__logo span {
  font-size: 0.8rem;
  opacity: 0.6;
}

.admin__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.admin__userinfo {
  overflow: hidden;
}

.admin__email {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin__role {
  font-size: 0.75rem;
  opacity: 0.6;
}

.admin__nav {
  flex: 1;
  padding: 16px 0;
}

.admin__link {
  display: block;
  padding: 12px 20px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: all 0.2s;
}

.admin__link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.admin__link.router-link-active {
  background: rgba(102, 126, 234, 0.3);
  color: white;
  border-left: 3px solid #667eea;
}

.admin__footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.2);
}

.admin__content {
  flex: 1;
  margin-left: 240px;
  background: #f5f7fa;
  min-height: 100vh;
}
</style>
