<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="glitch-wrapper">
        <h1 class="glitch" data-text="404">404</h1>
      </div>
      <h2 class="title">页面被华子哥吃了 🍔</h2>
      <p class="sub-text">
        你访问的页面可能去火星度假了，或者华子哥正在偷偷吃汉堡。<br/>
        别担心，这里还有很多好文章等你来看！
      </p>
      <div class="actions">
        <router-link to="/" class="btn btn--primary">🏠 返回首页</router-link>
        <router-link to="/articles" class="btn btn--secondary">📖 去看文章</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-primary);
}

.not-found__content {
  text-align: center;
  background: var(--bg-secondary);
  padding: 60px 40px;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  max-width: 650px;
  width: 100%;
  transition: background 0.3s, box-shadow 0.3s;
}

.glitch-wrapper {
  margin-bottom: 20px;
}

.glitch {
  font-size: 8rem;
  font-weight: 900;
  color: var(--accent);
  position: relative;
  margin: 0;
  line-height: 1;
  animation: shake 3s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #ff3b30;
  animation: glitch-1 2s infinite linear;
  clip-path: inset(0 0 60% 0);
}

.glitch::after {
  color: #58a6ff;
  animation: glitch-2 2s infinite linear;
  clip-path: inset(60% 0 0 0);
}

@keyframes shake {
  0%, 100% { transform: translate(0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-2px); }
  20%, 40%, 60%, 80% { transform: translate(2px); }
}

@keyframes glitch-1 {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 2px); }
  40% { transform: translate(3px, -2px); }
  60% { transform: translate(-2px, 1px); }
  80% { transform: translate(2px, -1px); }
  100% { transform: translate(0); }
}

@keyframes glitch-2 {
  0% { transform: translate(0); }
  20% { transform: translate(3px, -2px); }
  40% { transform: translate(-3px, 2px); }
  60% { transform: translate(2px, -1px); }
  80% { transform: translate(-2px, 1px); }
  100% { transform: translate(0); }
}

.title {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 16px 0 12px;
  font-weight: 700;
}

.sub-text {
  color: var(--text-secondary);
  font-size: 1.05rem;
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
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1.05rem;
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
  box-shadow: 0 4px 12px var(--accent-light);
}

.btn--secondary {
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn--secondary:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .not-found__content {
    padding: 40px 20px;
  }
  
  .glitch { font-size: 5rem; }
  
  .title { font-size: 1.4rem; }
  
  .actions { flex-direction: column; }
  
  .btn { width: 100%; justify-content: center; }
}
</style>
