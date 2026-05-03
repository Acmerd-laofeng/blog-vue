<template>
  <div class="star-rating">
    <!-- 星星显示区域 -->
    <div class="stars">
      <template v-for="i in 5" :key="i">
        <span class="star" :class="getStarClass(i)">{{ getStarChar(i) }}</span>
      </template>
    </div>
    <!-- 分数和评价人数 -->
    <div class="rating-info">
      <span class="rating-score">{{ score.toFixed(1) }}</span>
      <span v-if="count !== undefined" class="rating-count">({{ count }}人评价)</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    default: 0
  },
  count: {
    type: Number,
    default: undefined
  }
})

// 计算满星数量
const fullStars = computed(() => Math.floor(props.score))

// 计算是否有半星（小数部分 >= 0.25 且 < 0.75 算半星，>= 0.75 算满星）
const halfStarIndex = computed(() => {
  const decimal = props.score - fullStars.value
  if (decimal >= 0.75) return 0 // 进位为满星
  if (decimal >= 0.25) return fullStars.value + 1 // 半星
  return 0 // 空星
})

function getStarClass(i) {
  if (i <= fullStars.value) return 'star-full'
  if (i === halfStarIndex.value) return 'star-half'
  return 'star-empty'
}

function getStarChar(i) {
  // 满星用实心，半星和空星都用实心但颜色不同（半星用渐变遮罩）
  return '★'
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  position: relative;
}

.star {
  display: inline-block;
  font-size: 16px;
  line-height: 1;
  position: relative;
}

.star-full {
  color: #FFB800;
}

.star-empty {
  color: #E0E0E0;
}

.star-half {
  color: #E0E0E0;
  position: relative;
}

.star-half::before {
  content: '★';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: #FFB800;
}

.rating-info {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.rating-score {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.rating-count {
  font-size: 0.85rem;
  color: #999;
}
</style>
