<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar__header">
        <router-link to="/" class="logo-area" title="返回前台">
          <img src="/logo.png" alt="Acmerd" class="logo-img" />
        </router-link>
      </div>
      
      <nav class="sidebar__menu">
        <router-link to="/admin/dashboard" class="menu-item" active-class="active">
          <Icon name="dashboard" class="menu-icon" /> 仪表盘
        </router-link>
        
        <div class="menu-group-label">内容管理</div>
        <router-link to="/admin/articles" class="menu-item" active-class="active">
          <Icon name="article" class="menu-icon" /> 文章管理
        </router-link>
        <router-link to="/admin/companies" class="menu-item" active-class="active">
          <Icon name="building" class="menu-icon" /> 企业管理
        </router-link>
        <router-link to="/admin/banners" class="menu-item" active-class="active">
          <Icon name="image" class="menu-icon" /> 轮播图管理
        </router-link>
        <router-link to="/admin/works" class="menu-item" active-class="active">
          <Icon name="image" class="menu-icon" /> 作品管理
        </router-link>
        
        <div class="menu-group-label">互动与用户</div>
        <router-link to="/admin/comments" class="menu-item" active-class="active">
          <Icon name="comment" class="menu-icon" /> 评论管理
        </router-link>
        <router-link to="/admin/users" class="menu-item" active-class="active">
          <Icon name="user" class="menu-icon" /> 用户管理
        </router-link>
      </nav>

      <div class="sidebar__footer">
        <div class="user-profile">
          <div class="avatar">{{ authStore.user?.email?.charAt(0).toUpperCase() || 'A' }}</div>
          <div class="user-info">
            <span class="user-name">管理员</span>
            <span class="user-email">{{ authStore.user?.email }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <Icon name="logout" class="logout-icon" /> 退出登录
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Icon from '../../components/Icons.vue'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Apple 风格配色变量 */
:root {
  --apple-bg: #f5f5f7;
  --apple-card: #ffffff;
  --apple-sidebar: #1d1d1f;
  --apple-text: #1d1d1f;
  --apple-text-secondary: #86868b;
  --apple-blue: #0071e3;
  --apple-blue-hover: #0077ed;
  --apple-border: #d2d2d7;
  --apple-radius: 12px;
}

.admin-layout {
  display: flex;
  height: 100vh;
  background: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1d1d1f;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  background: #1d1d1f; /* Apple 深色侧边栏 */
  color: #f5f5f7;
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar__header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo-area:hover {
  opacity: 0.7;
}

.logo-img {
  height: 40px;
  width: auto;
  filter: brightness(0) invert(1);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.sidebar__menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.menu-group-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #86868b;
  margin: 24px 12px 8px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #d1d1d6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  font-weight: 500;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.menu-item.active {
  background: #0071e3; /* Apple Blue */
  color: #ffffff;
}

.menu-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.logout-icon {
  width: 1rem;
  height: 1rem;
}

.sidebar__footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #0071e3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f5f5f7;
}

.user-email {
  font-size: 0.75rem;
  color: #86868b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: #f5f5f7;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  .content-wrapper {
    padding: 20px;
  }
}
</style>
