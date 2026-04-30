<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">
          <img src="/logo.png" alt="ACMerD" />
        </router-link>
        <nav class="nav-center">
          <router-link to="/">首页</router-link>
          <router-link to="/articles">文章</router-link>
          <router-link to="/exchange">交流</router-link>
          <router-link to="/companies">企筛</router-link>
          <div class="search-box">
            <input type="text" placeholder="搜索内容..." />
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#999" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </div>
          <router-link to="/messages">消息</router-link>
          <router-link to="/history">历史</router-link>
          <router-link to="/create">创作</router-link>
          <router-link to="/feedback">反馈</router-link>
        </nav>
        <router-link to="/admin" class="nav-admin">后台</router-link>
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
.footer {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 0.85rem;
  margin-top: 40px;
}
</style>
