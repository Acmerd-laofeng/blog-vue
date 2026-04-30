<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">ACMerD</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/admin">后台</router-link>
        </nav>
      </div>
    </header>

    <!-- 页面内容区域（由路由动态切换） -->
    <router-view />

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 ACMerD. All rights reserved.</p>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #00a1d6;
  text-decoration: none;
}
.header nav a {
  margin-left: 20px;
  text-decoration: none;
  color: #333;
  font-size: 0.95rem;
}
.header nav a:hover {
  color: #00a1d6;
}
.footer {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 0.85rem;
  margin-top: 40px;
}
</style>
