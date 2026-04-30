<template>
  <div class="comments">
    <h3 class="comments__title">💬 评论区 ({{ comments.length }})</h3>

    <!-- 评论列表 -->
    <div class="comments__list">
      <div v-if="comments.length === 0" class="comments__empty">
        <p>暂无评论，来抢沙发吧！</p>
      </div>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-item__header">
          <span class="comment-item__name">{{ comment.user_name }}</span>
          <span class="comment-item__date">{{ formatDate(comment.created_at) }}</span>
        </div>
        <p class="comment-item__content">{{ comment.content }}</p>
      </div>
    </div>

    <!-- 评论表单 -->
    <form @submit.prevent="handleSubmit" class="comment-form">
      <h4>发表新评论</h4>
      <div class="form-group">
        <input 
          v-model="form.userName" 
          type="text" 
          placeholder="你的昵称" 
          required 
          class="form-input"
          maxlength="20"
        />
      </div>
      <div class="form-group">
        <textarea 
          v-model="form.content" 
          placeholder="说点什么吧..." 
          required 
          class="form-textarea"
          rows="4"
          maxlength="500"
        ></textarea>
      </div>
      <button type="submit" class="btn btn--primary" :disabled="submitting">
        {{ submitting ? '发送中...' : '发表评论' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { commentService } from '../services/commentService'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

const comments = ref([])
const submitting = ref(false)
const form = ref({
  userName: '',
  content: ''
})

async function loadComments() {
  comments.value = await commentService.getByArticle(props.articleId)
}

async function handleSubmit() {
  submitting.value = true
  try {
    await commentService.create({
      articleId: props.articleId,
      userName: form.value.userName,
      content: form.value.content
    })
    
    // 重置表单
    form.value.content = ''
    
    // 重新加载评论
    await loadComments()
    alert('评论发表成功！')
  } catch (error) {
    alert('发表失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comments {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.comments__title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 24px;
}

.comments__empty {
  text-align: center;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
  margin-bottom: 24px;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-item__name {
  font-weight: 700;
  color: #667eea;
}

.comment-item__date {
  font-size: 0.8rem;
  color: #999;
}

.comment-item__content {
  color: #444;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.comment-form {
  margin-top: 32px;
  background: white;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
}

.comment-form h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
