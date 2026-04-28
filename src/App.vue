<template>
  <div id="app">
    <header class="app-header" v-if="!isAdminPage">
      <div class="app-header__logo">
        <router-link to="/" class="app-header__title">Acmerd</router-link>
      </div>
      <nav class="app-header__nav">
        <router-link to="/companies" class="app-header__link">企业</router-link>
        <router-link to="/articles" class="app-header__link">文章</router-link>
        <router-link v-if="authStore.isLoggedIn" to="/admin/dashboard" class="app-header__link admin-badge">后台</router-link>
        <router-link v-else to="/login" class="app-header__link">登录</router-link>
      </nav>
    </header>
    <main class="app-main" :class="{ 'app-main--admin': isAdminPage }">
      <router-view />
    </main>
    <footer class="app-footer" v-if="!isAdminPage">
      <p>&copy; 2026 Acmerd - 企业信息收录平台</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const isAdminPage = computed(() => route.path.startsWith('/admin'))
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__logo {
  display: flex;
  align-items: center;
}

.app-header__title {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.app-header__link {
  color: #666;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.app-header__link:hover {
  background: #f5f5f5;
  color: #667eea;
}

.app-header__link.router-link-active {
  color: #667eea;
  background: #f0f0ff;
}

.admin-badge {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
}

.app-main {
  min-height: calc(100vh - 120px);
}

.app-main--admin {
  min-height: 100vh;
}

.app-footer {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
}
</style>
