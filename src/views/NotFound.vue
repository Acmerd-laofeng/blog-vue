<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__code">404</h1>
      <h2 class="not-found__title">哎呀，页面走丢了</h2>
      <p class="not-found__desc">你访问的页面可能已经被移除、更名或暂时不可用。</p>
      <div class="not-found__actions">
        <router-link to="/" class="btn btn--primary">回到首页</router-link>
        <router-link to="/articles" class="btn btn--secondary">去看看文章</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px;
}

.not-found__content {
  text-align: center;
  max-width: 600px;
}

.not-found__code {
  font-size: 8rem;
  font-weight: 800;
  color: #2C54FB;
  margin: 0;
  line-height: 1;
  text-shadow: 4px 4px 0px rgba(0,0,0,0.1);
}

.not-found__title {
  font-size: 2rem;
  color: #333;
  margin: 16px 0 8px;
}

.not-found__desc {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 32px;
}

.not-found__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--primary {
  background: #2C54FB;
  color: white;
}

.btn--secondary {
  background: white;
  color: #2C54FB;
  border: 1px solid #2C54FB;
}
</style>
