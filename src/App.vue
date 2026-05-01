<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <img src="/logo.png" alt="ACMerD" />
        </router-link>
        
        <!-- 桌面端导航 (隐藏于移动端) -->
        <nav class="nav-center">
          <router-link to="/">首页</router-link>
          <router-link to="/articles">文章</router-link>
          <router-link to="/companies">企筛</router-link>
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              @keyup.enter="handleSearch" 
              placeholder="搜索文章、企业..." 
            />
            <button type="button" @click="handleSearch" class="search-btn">
              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#667eea" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
          </div>
          <router-link to="/create">创作</router-link>
          <router-link to="/feedback">反馈</router-link>
        </nav>

        <div class="header-actions">
          <!-- 未登录：显示登录 -->
          <router-link v-if="!authStore.user" to="/login" class="nav-login">登录</router-link>
          
          <!-- 已登录：显示用户名 + 退出 -->
          <div v-else class="user-menu">
            <span class="user-name">👋 {{ authStore.user.user_metadata?.username || '用户' }}</span>
            <button @click="handleLogout" class="nav-logout">退出</button>
          </div>
          
          <!-- 后台入口 (仅管理员可见) -->
          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-admin">后台</router-link>
          
          <button class="hamburger" @click="isMenuOpen = !isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="isMenuOpen" class="mobile-menu">
        <router-link to="/" @click="isMenuOpen = false">首页</router-link>
        <router-link to="/articles" @click="isMenuOpen = false">文章</router-link>
        <router-link to="/companies" @click="isMenuOpen = false">企筛</router-link>
        <router-link to="/create" @click="isMenuOpen = false">创作</router-link>
        <router-link to="/feedback" @click="isMenuOpen = false">反馈</router-link>
        <div class="mobile-search">
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch; isMenuOpen = false" 
            placeholder="搜索内容..." 
          />
        </div>
      </div>
    </header>

    <!-- 页面内容区域（由路由动态切换） -->
    <router-view />

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 ACMerD. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const isMenuOpen = ref(false)

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    isMenuOpen.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1464px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 56px;
  position: relative;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 汉堡菜单按钮 */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s;
}
.logo {
  flex-shrink: 0;
}
.logo img {
  height: 36px;
  width: auto;
}
.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 0 24px;
}
.nav-center a {
  text-decoration: none;
  color: #333;
  font-size: 0.95rem;
  white-space: nowrap;
  transition: color 0.2s;
}
.nav-center a:hover {
  color: #00a1d6;
}
.nav-center a.router-link-active {
  color: #00a1d6;
  font-weight: 600;
}
.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 4px 12px;
  gap: 6px;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.85rem;
  width: 120px;
  color: #333;
}
.search-box input::placeholder {
  color: #999;
}
.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.search-btn:hover svg path {
  fill: #764ba2;
}
.nav-admin {
  flex-shrink: 0;
  text-decoration: none;
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
  transition: color 0.2s;
}
.nav-admin:hover {
  color: #764ba2;
}

/* 用户菜单样式 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.nav-logout {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.nav-logout:hover {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.nav-login {
  text-decoration: none;
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
}

/* 移动端菜单样式 */
.mobile-menu {
  display: none;
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 16px 20px;
  flex-direction: column;
  gap: 16px;
  z-index: 200;
}

.mobile-menu a {
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-menu a:hover {
  color: #667eea;
}

.mobile-search {
  margin-top: 8px;
}

.mobile-search input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

/* 汉堡菜单按钮 */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-center {
    display: none; /* 隐藏桌面导航 */
  }
  
  .hamburger {
    display: flex; /* 显示汉堡菜单 */
  }
  
  .mobile-menu {
    display: flex; /* 激活时显示 */
  }
  
  /* 当菜单关闭时隐藏移动端菜单容器 */
  .mobile-menu:not(.active) {
     /* Vue v-if controls this, but CSS backup */
  }
  
  .nav-admin {
    font-size: 0.9rem;
  }
}
.footer {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 0.85rem;
  margin-top: 40px;
}
</style>
