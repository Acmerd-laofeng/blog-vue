import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Acmerd - 华子哥的秘密基地' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue'),
    meta: { 
      title: '文章列表 - Acmerd',
      description: '华子哥的文章。'
    }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: { 
      title: '文章详情 - Acmerd',
      description: '各种文章。'
    }
  },
  {
    path: '/companies',
    name: 'companies',
    component: () => import('../views/CompaniesView.vue'),
    meta: { 
      title: '企业列表 - Acmerd',
      description: '企筛筛，筛掉不适合你的企业。'
    }
  },
  {
    path: '/company/:id',
    name: 'company-detail',
    component: () => import('../views/CompanyDetail.vue'),
    meta: { title: '企业详情 - Acmerd' }
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: () => import('../views/ExchangeView.vue'),
    meta: { title: '交流社区 - Acmerd' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/MessagesView.vue'),
    meta: { title: '消息中心 - Acmerd' }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: { title: '历史归档 - Acmerd' }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/CreateView.vue'),
    meta: { title: '创作中心 - Acmerd' }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../views/FeedbackView.vue'),
    meta: { title: '反馈建议 - Acmerd' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
    meta: { title: '搜索结果 - Acmerd' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: '个人中心 - Acmerd' }
  },
  // 后台路由
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboard.vue') },
      { path: 'articles', name: 'admin-articles', component: () => import('../views/admin/AdminArticles.vue') },
      { path: 'articles/new', name: 'admin-article-new', component: () => import('../views/admin/AdminArticleForm.vue') },
      { path: 'articles/edit/:id', name: 'admin-article-edit', component: () => import('../views/admin/AdminArticleForm.vue') },
      { path: 'companies', name: 'admin-companies', component: () => import('../views/admin/AdminCompanies.vue') },
      { path: 'companies/new', name: 'admin-company-new', component: () => import('../views/admin/AdminCompanyForm.vue') },
      { path: 'companies/edit/:id', name: 'admin-company-edit', component: () => import('../views/admin/AdminCompanyForm.vue') },
      { path: 'banners', name: 'admin-banners', component: () => import('../views/admin/AdminBanners.vue') },
      { path: 'banners/new', name: 'admin-banner-new', component: () => import('../views/admin/AdminBannerForm.vue') },
      { path: 'banners/edit/:id', name: 'admin-banner-edit', component: () => import('../views/admin/AdminBannerForm.vue') },
      { path: 'comments', name: 'admin-comments', component: () => import('../views/admin/AdminComments.vue') },
      { path: 'users', name: 'admin-users', component: () => import('../views/admin/AdminUsers.vue') },
      { path: 'exchange', name: 'admin-exchange', component: () => import('../views/admin/AdminExchange.vue') },
      { path: 'messages', name: 'admin-messages', component: () => import('../views/admin/AdminMessages.vue') },
      { path: 'history', name: 'admin-history', component: () => import('../views/admin/AdminHistory.vue') },
      { path: 'create', name: 'admin-create', component: () => import('../views/admin/AdminCreate.vue') },
      { path: 'feedback', name: 'admin-feedback', component: () => import('../views/admin/AdminFeedback.vue') }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录 - Acmerd' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 后台页面权限控制
  if (to.meta.requiresAuth) {
    if (!authStore.user || !authStore.isAdmin) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }

  document.title = to.meta.title || 'Acmerd'
  const description = document.querySelector('meta[name="description"]')
  if (description && to.meta.description) {
    description.setAttribute('content', to.meta.description)
  }
  
  next()
})

export default router
