import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Acmerd - 企业信息收录平台' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue'),
    meta: { title: '文章列表 - Acmerd' }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: { title: '文章详情 - Acmerd' }
  },
  {
    path: '/companies',
    name: 'companies',
    component: () => import('../views/CompaniesView.vue'),
    meta: { title: '企业列表 - Acmerd' }
  },
  {
    path: '/company/:id',
    name: 'company-detail',
    component: () => import('../views/CompanyDetail.vue'),
    meta: { title: '企业详情 - Acmerd' }
  },
  // 新导航页面
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
  // 后台路由
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, title: '管理后台 - Acmerd' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboard.vue')
      },
      // 文章管理
      {
        path: 'articles',
        name: 'admin-articles',
        component: () => import('../views/admin/AdminArticles.vue')
      },
      {
        path: 'articles/new',
        name: 'admin-article-new',
        component: () => import('../views/admin/AdminArticleForm.vue')
      },
      {
        path: 'articles/edit/:id',
        name: 'admin-article-edit',
        component: () => import('../views/admin/AdminArticleForm.vue')
      },
      // 企业管理
      {
        path: 'companies',
        name: 'admin-companies',
        component: () => import('../views/admin/AdminCompanies.vue')
      },
      {
        path: 'companies/new',
        name: 'admin-company-new',
        component: () => import('../views/admin/AdminCompanyForm.vue')
      },
      {
        path: 'companies/edit/:id',
        name: 'admin-company-edit',
        component: () => import('../views/admin/AdminCompanyForm.vue')
      },
      // 轮播图管理
      {
        path: 'banners',
        name: 'admin-banners',
        component: () => import('../views/admin/AdminBanners.vue')
      },
      {
        path: 'banners/new',
        name: 'admin-banner-new',
        component: () => import('../views/admin/AdminBannerForm.vue')
      },
      {
        path: 'banners/edit/:id',
        name: 'admin-banner-edit',
        component: () => import('../views/admin/AdminBannerForm.vue')
      },
      // 新模块后台
      {
        path: 'exchange',
        name: 'admin-exchange',
        component: () => import('../views/admin/AdminExchange.vue')
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: () => import('../views/admin/AdminMessages.vue')
      },
      {
        path: 'history',
        name: 'admin-history',
        component: () => import('../views/admin/AdminHistory.vue')
      },
      {
        path: 'create',
        name: 'admin-create',
        component: () => import('../views/admin/AdminCreate.vue')
      },
      {
        path: 'feedback',
        name: 'admin-feedback',
        component: () => import('../views/admin/AdminFeedback.vue')
      }
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
  
  if (!authStore.session) {
    await authStore.checkAuth()
  }
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    document.title = to.meta.title || 'Acmerd'
    next()
  }
})

export default router
