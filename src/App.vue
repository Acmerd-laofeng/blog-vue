<template>
  <div id="app">
    <header class="app-header">
      <div class="app-header__logo">
        <img src="./assets/logo.svg" alt="Logo" />
        <span class="app-header__title">我的博客</span>
      </div>
      <nav class="app-header__nav">
        <router-link to="/" class="app-header__link">首页</router-link>
        <router-link to="/admin/posts" class="app-header__link">管理</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <p>&copy; 2026 我的博客. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__logo img {
  width: 32px;
  height: 32px;
}

.app-header__title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.app-header__nav {
  display: flex;
  gap: 16px;
}

.app-header__link {
  color: #666;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.app-header__link:hover {
  background: #f5f5f5;
  color: #42b883;
}

.app-header__link.router-link-active {
  color: #42b883;
  font-weight: bold;
}

.app-main {
  min-height: calc(100vh - 120px);
  padding: 24px 0;
}

.app-footer {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
}
</style>
