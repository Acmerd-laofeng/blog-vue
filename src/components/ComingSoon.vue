<template>
  <div class="coming-soon">
    <div class="coming-soon__content">
      <div class="icon-box">🚧</div>
      <h1>华子哥正在施工中...</h1>
      <p class="sub-text">{{ message }}</p>
      <div class="actions">
        <router-link to="/" class="btn btn--primary">🏠 返回首页</router-link>
        <router-link to="/articles" class="btn btn--secondary">📖 去看文章</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '该功能正在紧张开发中，敬请期待！'
  }
})
</script>

<style scoped>
.coming-soon {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-primary);
}

.coming-soon__content {
  text-align: center;
  background: var(--bg-secondary);
  padding: 60px 40px;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 100%;
  transition: background 0.3s, box-shadow 0.3s;
}

.icon-box {
  font-size: 5rem;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 800;
}

.sub-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn--primary {
  background: var(--accent);
  color: white;
}

.btn--primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn--secondary {
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn--secondary:hover {
  background: var(--bg-hover);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@media (max-width: 600px) {
  .coming-soon__content {
    padding: 40px 20px;
  }
  
  h1 { font-size: 1.5rem; }
  
  .actions { flex-direction: column; }
  
  .btn { width: 100%; justify-content: center; }
}
</style>
