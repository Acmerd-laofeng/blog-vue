<template>
  <div class="works-view">
    <div class="works-header">
      <h1>🎨 艺术作品</h1>
      <p>华子哥的创作空间</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="works.length === 0" class="empty-state">
      <p>🖼️ 还没有作品，敬请期待！</p>
    </div>

    <!-- 作品网格 (Masonry 瀑布流风格) -->
    <div v-else class="works-grid">
      <div 
        v-for="work in works" 
        :key="work.id" 
        class="work-card"
        @click="openLightbox(work)"
      >
        <img :src="work.image_url" :alt="work.title" loading="lazy" />
        <div class="work-overlay">
          <h3>{{ work.title }}</h3>
          <p v-if="work.description">{{ work.description }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox 大图查看 -->
    <Teleport to="body">
      <div v-if="lightboxWork" class="lightbox" @click="closeLightbox">
        <button class="lightbox-close" @click.stop="closeLightbox">×</button>
        <div class="lightbox-content" @click.stop>
          <img :src="lightboxWork.image_url" :alt="lightboxWork.title" />
          <div class="lightbox-info">
            <h2>{{ lightboxWork.title }}</h2>
            <p v-if="lightboxWork.description">{{ lightboxWork.description }}</p>
            <p class="lightbox-date">{{ formatDate(lightboxWork.created_at) }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { workService } from '../services/workService'

const works = ref([])
const loading = ref(true)
const lightboxWork = ref(null)

onMounted(async () => {
  try {
    works.value = await workService.getAll()
  } catch (err) {
    console.error('加载作品失败:', err)
  } finally {
    loading.value = false
  }
})

function openLightbox(work) {
  lightboxWork.value = work
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxWork.value = null
  document.body.style.overflow = ''
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })
}
</script>

<style scoped>
.works-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.works-header {
  text-align: center;
  margin-bottom: 3rem;
}

.works-header h1 {
  font-size: 2.5rem;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
}

.works-header p {
  color: #86868b;
  font-size: 1.1rem;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007aff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #86868b;
  font-size: 1.2rem;
}

/* 作品网格 (CSS Grid 瀑布流效果) */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.work-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f7;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.work-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.work-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.work-card:hover .work-overlay {
  transform: translateY(0);
}

.work-overlay h3 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.work-overlay p {
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2.5rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.lightbox-close:hover {
  opacity: 1;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-info {
  text-align: center;
  color: white;
  margin-top: 1.5rem;
}

.lightbox-info h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.lightbox-info p {
  color: rgba(255,255,255,0.8);
  margin-bottom: 0.5rem;
}

.lightbox-date {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5) !important;
}

/* 响应式 */
@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .work-card img {
    height: 220px;
  }
}
</style>
