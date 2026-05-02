<template>
  <footer class="app-footer">
    <div class="container footer-main">
      <!-- 品牌区域 -->
      <div class="footer-brand">
        <h3 class="brand-name">华子哥的秘密基地</h3>
        <p class="brand-desc">专注技术分享 · 艺术作品 · 生活记录</p>
        <p class="brand-intro">在这里，记录每一个成长的瞬间。<br>用心创作，真诚分享。</p>
      </div>

      <!-- 链接区域 -->
      <div class="footer-links">
        <div class="link-group">
          <h4>关注我</h4>
          <div class="social-icons">
            <a href="#" class="social-link" title="微信公众号">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8.69 13.19c-.33 0-.65-.06-.97-.18l-.26.25-.11.11c.04-.13.06-.26.06-.41 0-1.42 1.45-2.58 3.23-2.58.47 0 .91.08 1.32.22-.23-1.18-1.51-2.1-3.02-2.1-1.74 0-3.15 1.16-3.15 2.58 0 1.42 1.41 2.58 3.15 2.58.32 0 .64-.06.94-.18l.26.25.11.11c-.04-.13-.06-.26-.06-.41 0-1.42 1.45-2.58 3.23-2.58.47 0 .91.08 1.32.22-.23-1.18-1.51-2.1-3.02-2.1zm5.54-3.38c.32 0 .64.06.94.18l.26-.25.11-.11c-.04.13-.06.26-.06.41 0 1.42 1.45 2.58 3.23 2.58 1.78 0 3.23-1.16 3.23-2.58 0-1.42-1.45-2.58-3.23-2.58-.32 0-.64.06-.94.18l-.26-.25-.11-.11c.04.13.06.26.06.41 0 1.42-1.45 2.58-3.23 2.58zm-2.49 8.87c-3.9 0-7.08-2.35-7.08-5.25 0-2.9 3.18-5.25 7.08-5.25 3.9 0 7.08 2.35 7.08 5.25 0 2.9-3.18 5.25-7.08 5.25z"/></svg>
              <span>公众号</span>
            </a>
            <a href="#" class="social-link" title="Bilibili">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.6 13.2c.3.3.3.8 0 1.1-.2.2-.5.3-.8.3-.2 0-.4-.1-.6-.2l-4.2-4.2v6.6c0 .4-.4.8-.8.8s-.8-.4-.8-.8v-6.6l-4.2 4.2c-.2.2-.4.2-.6.2-.3 0-.5-.1-.8-.3-.3-.3-.3-.8 0-1.1l4.8-4.8c.2-.2.4-.2.6-.2s.4.1.6.2l4.8 4.8zM20 5c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h2V3h12v2h2z"/></svg>
              <span>B 站</span>
            </a>
            <a href="#" class="social-link" title="小红书">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              <span>小红书</span>
            </a>
          </div>
        </div>

        <div class="link-group">
          <h4>了解更多</h4>
          <ul>
            <li><a href="#">关于华子哥</a></li>
            <li><router-link to="/privacy">隐私政策</router-link></li>
            <li><router-link to="/terms">用户协议</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Acmerd. All rights reserved.</p>
        <p class="beian">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow">ICP 备案号：京 ICP 备 2026000000 号</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  margin-top: 60px;
  transition: background 0.3s, border-color 0.3s;
}

.footer-main {
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
}

/* 品牌区域 */
.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.brand-desc {
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  color: var(--text-tertiary);
}

.brand-intro {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 链接区域 */
.footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.link-group h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

/* 社交图标 */
.social-icons {
  display: flex;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--accent);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 10px;
}

.link-group a,
.link-group .router-link-active {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.link-group a:hover {
  color: var(--accent);
}

/* 底部版权 */
.footer-bottom {
  background: var(--bg-input);
  padding: 16px 20px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  border-top: 1px solid var(--border-light);
}

.footer-bottom p {
  margin: 4px 0;
}

.beian a {
  color: var(--text-tertiary);
  text-decoration: none;
}

.beian a:hover {
  color: var(--text-secondary);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .social-icons {
    justify-content: center;
  }
}
</style>
