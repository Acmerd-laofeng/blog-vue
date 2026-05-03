<template>
  <div id="app">
    <!-- 顶部导航栏 (登录页隐藏) -->
    <header v-if="!hideNavbar" class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <img src="/logo.png" alt="Acmerd" />
        </router-link>

        <!-- 中间导航 (桌面端显示) -->
        <nav class="nav-center">
          <router-link to="/">首页</router-link>
          <router-link to="/articles">文章</router-link>
          <router-link to="/companies">企筛筛</router-link>
          <router-link to="/works">作品</router-link>
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="搜索文章..."
            />
            <button type="button" @click="handleSearch" class="search-btn">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="#2C54FB"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>
          </div>
        </nav>

        <div class="header-actions">
          <!-- 暗黑模式切换 -->
          <button @click="themeStore.toggle" class="theme-toggle" :title="themeStore.isDark ? '切换到亮色' : '切换到暗色'">
            <span v-if="themeStore.isDark">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- 未登录时显示登录 -->
          <router-link v-if="!authStore.user" to="/login" class="nav-login">登录</router-link>

          <!-- 已登录时显示用户名 + 退出 -->
          <div v-else class="user-menu">
            <router-link to="/profile" class="user-profile-link">个人中心</router-link>
            <span class="user-name">👤 {{ authStore.user.user_metadata?.username || '用户' }}</span>
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
        <router-link to="/companies" @click="isMenuOpen = false">企筛筛</router-link>
        <router-link to="/works" @click="isMenuOpen = false">作品</router-link>
        <div class="mobile-search">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch; isMenuOpen = false"
            placeholder="搜索文章..."
          />
        </div>
      </div>
    </header>

    <!-- 页面内容 (根据路由动态切换) -->
    <router-view />

    <!-- 页脚 (登录页隐藏) -->
    <AppFooter v-if="!hideNavbar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const searchQuery = ref('')
const isMenuOpen = ref(false)

// 初始化主题
onMounted(() => {
  themeStore.init()
})

// 登录/注册页隐藏导航栏和页脚
const hideNavbar = computed(() => route.path === '/login')

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
  background: var(--bg-secondary);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s, box-shadow 0.3s;
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
  background: var(--text-primary);
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
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: nowrap;
  transition: color 0.2s;
}
.nav-center a:hover {
  color: var(--accent);
}
.nav-center a.router-link-active {
  color: var(--accent);
  font-weight: 600;
}
.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border-radius: 20px;
  padding: 4px 12px;
  gap: 6px;
  transition: background 0.3s;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.85rem;
  width: 120px;
  color: var(--text-primary);
}
.search-box input::placeholder {
  color: var(--text-tertiary);
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
  fill: #2c54fb;
}
.nav-admin {
  flex-shrink: 0;
  text-decoration: none;
  color: var(--accent);
  font-size: 0.95rem;
  font-weight: 600;
  transition: color 0.2s;
}
.nav-admin:hover {
  color: var(--accent);
}

/* 用户菜单样式 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.user-profile-link {
  text-decoration: none;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.user-profile-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
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
  color: var(--accent);
  font-size: 0.95rem;
  font-weight: 600;
  transition: color 0.2s;
}

.nav-login:hover {
  color: var(--accent-hover);
}

/* 暗黑模式切换按钮 */
.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: var(--bg-input);
}

/* 移动端菜单样式 */
.mobile-menu {
  display: none;
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  box-shadow: var(--shadow-lg);
  padding: 16px 20px;
  flex-direction: column;
  gap: 16px;
  z-index: 200;
}

.mobile-menu a {
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.mobile-menu a:hover {
  color: var(--accent);
}

.mobile-search {
  margin-top: 8px;
}

.mobile-search input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  background: var(--bg-input);
  color: var(--text-primary);
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
    display: flex; /* 点击时显示 */
  }

  .nav-admin {
    font-size: 0.9rem;
  }
}
</style>
