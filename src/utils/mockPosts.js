// 模拟文章数据提供器
export const mockPosts = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 完全指南',
    excerpt: '深入理解 Composition API，掌握 Vue 3 的核心特性...',
    cover: 'https://picsum.photos/seed/vue3/800/400',
    date: '2026-04-20',
    category: '前端开发',
    content: [
      'Vue 3 的组合式 API（Composition API）是一种全新的组织组件逻辑的方式。与选项式 API（Options API）不同，组合式 API 允许我们根据逻辑关注点来组织代码。',
      '组合式 API 的核心是 setup() 函数。在这个函数中，我们可以使用 ref、reactive、computed、watch 等 API 来创建响应式数据和逻辑。',
      '使用组合式 API 的最大好处是更好的代码复用。通过组合函数（Composables），我们可以将相关的逻辑封装成可复用的模块。',
      '在实际项目中，我们推荐使用 <script setup> 语法糖，它让组合式 API 的使用更加简洁和直观。'
    ]
  },
  {
    id: 2,
    title: 'Pinia 状态管理实战',
    excerpt: '从入门到精通，掌握 Vue 3 官方推荐的状态管理库...',
    cover: 'https://picsum.photos/seed/pinia/800/400',
    date: '2026-04-18',
    category: '前端开发',
    content: [
      'Pinia 是 Vue 3 官方推荐的状态管理库，它是 Vuex 的下一代替代品。Pinia 提供了更简洁的 API 和更好的 TypeScript 支持。',
      'Pinia 的核心概念是 Store（存储）。每个 Store 包含 state（状态）、getters（计算属性）和 actions（方法）。',
      '与 Vuex 相比，Pinia 去掉了 mutations，只保留了 state、getters 和 actions，使得 API 更加简洁。',
      '在 Vue 3 项目中，使用 Pinia 是最佳选择。它不仅支持 Vue 3 的组合式 API，还提供了强大的 Devtools 支持。'
    ]
  },
  {
    id: 3,
    title: 'CSS Grid 布局完全指南',
    excerpt: '掌握现代 CSS 布局技术，告别浮动和定位...',
    cover: 'https://picsum.photos/seed/css-grid/800/400',
    date: '2026-04-15',
    category: 'CSS',
    content: [
      'CSS Grid 是 CSS 中最强大的布局系统。它是一个二维布局系统，可以同时处理行和列。',
      '使用 Grid 布局，我们可以轻松创建复杂的页面布局，而无需使用浮动或定位。',
      'Grid 容器的核心属性包括：grid-template-columns、grid-template-rows、gap 等。',
      'Grid 项目的核心属性包括：grid-column、grid-row、grid-area 等。'
    ]
  },
  {
    id: 4,
    title: 'TypeScript 类型体操入门',
    excerpt: '掌握 TypeScript 高级类型，写出更安全的代码...',
    cover: 'https://picsum.photos/seed/typescript/800/400',
    date: '2026-04-12',
    category: 'TypeScript',
    content: [
      'TypeScript 的类型系统非常强大，支持泛型、条件类型、映射类型等高级特性。',
      '泛型（Generics）是 TypeScript 中最常用的特性之一。它允许我们创建可复用的组件，同时保持类型安全。',
      '条件类型（Conditional Types）允许我们根据类型条件来选择不同的类型。',
      '映射类型（Mapped Types）允许我们基于已有类型创建新类型。'
    ]
  },
  {
    id: 5,
    title: 'Node.js 性能优化实战',
    excerpt: '从内存管理到事件循环，全面提升 Node.js 应用性能...',
    cover: 'https://picsum.photos/seed/nodejs/800/400',
    date: '2026-04-10',
    category: '后端开发',
    content: [
      'Node.js 的性能优化是一个系统性工程，需要从多个角度入手。',
      '内存管理是 Node.js 性能优化的关键。我们需要了解 V8 引擎的垃圾回收机制，避免内存泄漏。',
      '事件循环（Event Loop）是 Node.js 的核心机制。理解事件循环有助于我们写出更高效的异步代码。',
      '使用性能分析工具（如 clinic.js、0x）可以帮助我们定位性能瓶颈。'
    ]
  }
]
