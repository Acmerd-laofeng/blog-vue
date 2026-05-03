<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <Icon name="error" class="error-icon" />
      <h3>加载出错了</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <button class="btn-retry" @click="handleRetry"><Icon name="refresh" class="btn-icon" /> 重新加载</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import Icon from './Icons.vue'

const props = defineProps({
  retry: {
    type: Function,
    default: null
  }
})

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err.message || '未知错误'
  console.error('ErrorBoundary caught:', err)
  return false // Prevent error from propagating further
})

function handleRetry() {
  hasError.value = false
  if (props.retry) {
    props.retry()
  } else {
    location.reload()
  }
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
}

.error-content {
  text-align: center;
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  max-width: 400px;
  width: 100%;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 16px;
  color: var(--error);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 4px;
  animation: spin 1s linear infinite;
}

h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.error-message {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 0.9rem;
  word-break: break-all;
}

.btn-retry {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: var(--accent-hover);
}
</style>
