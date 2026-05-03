<template>
  <div class="star-rating">
    <!-- 星星显示区域 -->
    <div class="stars">
      <template v-for="i in 5" :key="i">
        <span class="star" :class="{ full: i <= fullStars, half: i === halfStar }">
          <svg viewBox="0 0 24 24" :class="i <= fullStars ? 'filled' : (i === halfStar ? 'half-filled' : 'empty')">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </span>
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
  },
  max: {
    type: Number,
    default: 5
  }
})

// 计算满星数量
const fullStars = computed(() => Math.floor(props.score))

// 计算是否有半星
const halfStar = computed(() => {
  const decimal = props.score - fullStars.value
  return decimal >= 0.25 && decimal < 0.75 ? fullStars.value + 1 : 0
})
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
  gap: 2px;
}

.star {
  display: inline-flex;
  position: relative;
  width: 16px;
  height: 16px;
}

.star svg {
  width: 16px;
  height: 16px;
}

.star.filled svg {
  fill: #FFB800;
  stroke: none;
}

.star.half-filled {
  position: relative;
}

.star.half-filled svg {
  fill: #E8E8E8;
  stroke: none;
}

.star.half-filled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: #FFB800;
  -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat center / contain;
  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") no-repeat center / contain;
}

.star.empty svg {
  fill: #E8E8E8;
  stroke: none;
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
