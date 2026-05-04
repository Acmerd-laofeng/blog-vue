<!-- Apple 风格暗黑模式切换开关 -->
<template>
  <div class="toggle-wrapper">
    <Icon name="sun" class="toggle-icon sun-icon" :class="{ active: !modelValue }" />
    <label class="apple-toggle" :class="{ 'is-active': modelValue }" @click="$emit('update:modelValue', !modelValue)">
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', !modelValue)" />
      <span class="toggle-track">
        <span class="toggle-thumb"></span>
      </span>
    </label>
    <Icon name="moon" class="toggle-icon moon-icon" :class="{ active: modelValue }" />
  </div>
</template>

<script setup>
import Icon from './Icons.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  width: 18px;
  height: 18px;
  color: #999;
  transition: color 0.3s;
}

.sun-icon.active {
  color: #FF9500;
}

.moon-icon.active {
  color: #5856D6;
}

/* 暗黑模式下的图标颜色 */
:root.dark .sun-icon {
  color: #666;
}

:root.dark .moon-icon {
  color: #8E8E93;
}

:root.dark .sun-icon.active {
  color: #FF9F0A;
}

:root.dark .moon-icon.active {
  color: #BF5AF2;
}

.apple-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.apple-toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
  background: #e9e9ea;
  border-radius: 15.5px;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 15.5px;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.04);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px;
  height: 27px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

/* 暗黑模式下的轨道 */
:root.dark .toggle-track {
  background: #3a3a3c;
}

:root.dark .toggle-track::after {
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.08);
}

:root.dark .toggle-thumb {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 激活状态 - 绿色 */
.apple-toggle.is-active .toggle-track {
  background: #34C759;
}

.apple-toggle.is-active .toggle-thumb {
  transform: translateX(20px);
}

/* 暗黑模式下激活状态 */
:root.dark .apple-toggle.is-active .toggle-track {
  background: #30D158;
}

/* 悬停效果 */
.apple-toggle:hover .toggle-track {
  filter: brightness(0.95);
}

.apple-toggle.is-active:hover .toggle-track {
  filter: brightness(1.05);
}

/* 点击按压效果 */
.apple-toggle:active .toggle-thumb {
  width: 31px;
}

.apple-toggle.is-active:active .toggle-thumb {
  transform: translateX(16px);
}
</style>
