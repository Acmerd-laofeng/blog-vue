import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'

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
      description: '阅读精彩内容 - Acmerd 华子哥的秘密基地'
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
    meta: { 
      title: '企业详情 - Acmerd',
      description: '查看企业真实评价 - Acmerd'
    }
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: () => import('../components/ComingSoon.vue'),
    props: { message: '交流社区正在建设中，华子哥正在努力搭建话题讨论区...' },
    meta: { title: '即将上线 - 交流社区' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../components/ComingSoon.vue'),
    props: { message: '消息中心正在建设中，华子哥正在努力开发私信系统...' },
    meta: { title: '即将上线 - 消息中心' }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../components/ComingSoon.vue'),
    props: { message: '历史归档正在建设中，精彩内容即将上线...' },
    meta: { title: '即将上线 - 历史归档' }
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../components/ComingSoon.vue'),
    props: { message: '创作中心正在建设中，敬请期待前台投稿功能...' },
    meta: { title: '即将上线 - 创作中心' }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../components/ComingSoon.vue'),
    props: { message: '反馈建议正在建设中，如有问题请联系华子哥...' },
    meta: { title: '即将上线 - 反馈建议' }
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
      { path: 'exchange', name: 'admin-exchange', component: () => import('../components/ComingSoon.vue'), props: { message: '交流社区管理功能开发中...' } },
      { path: 'messages', name: 'admin-messages', component: () => import('../components/ComingSoon.vue'), props: { message: '消息中心管理功能开发中...' } },
      { path: 'history', name: 'admin-history', component: () => import('../components/ComingSoon.vue'), props: { message: '历史归档管理功能开发中...' } },
      { path: 'create', name: 'admin-create', component: () => import('../components/ComingSoon.vue'), props: { message: '前台创作中心开发中...' } },
      { path: 'feedback', name: 'admin-feedback', component: () => import('../components/ComingSoon.vue'), props: { message: '反馈管理功能开发中...' } }
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
  
  // 【修复】：页面刷新时，强制检查 Session，防止因加载慢被误判为未登录
  if (!authStore.user) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      authStore.user = session.user
    }
  }
  
  // 后台页面权限控制
  if (to.meta.requiresAuth) {
    if (!authStore.user || !authStore.isAdmin) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }

  // 设置页面标题
  document.title = to.meta.title || 'Acmerd - 华子哥的秘密基地'
  
  // 更新 SEO 描述
  let description = document.querySelector('meta[name="description"]')
  if (!description) {
    description = document.createElement('meta')
    description.name = 'description'
    document.head.appendChild(description)
  }
  description.setAttribute('content', to.meta.description || '华子哥的秘密基地 - 企业信息收录平台')
  
  // 更新 Open Graph 标签
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (!ogTitle) {
    ogTitle = document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    document.head.appendChild(ogTitle)
  }
  ogTitle.setAttribute('content', to.meta.title || 'Acmerd')
  
  let ogDesc = document.querySelector('meta[property="og:description"]')
  if (!ogDesc) {
    ogDesc = document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    document.head.appendChild(ogDesc)
  }
  ogDesc.setAttribute('content', to.meta.description || '华子哥的秘密基地')
  
  next()
})

export default router
