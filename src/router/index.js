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

// 路由守卫 - 检查登录状态
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果还没有初始化，先检查
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
