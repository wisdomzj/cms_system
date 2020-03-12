import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' },
      hidden: true
    }]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/user',
    redirect: '/user/index',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'peoples', roles: ['admin', 'editor'] }
      },
      {
        path: 'changpwd',
        component: () => import('@/views/user/changpwd'),
        meta: {
          title: '修改密码',
          roles: ['admin', 'editor']
        },
        hidden: true
      }
    ]
  },

  {
    path: '/article',
    redirect: '/article/list',
    component: Layout,
    meta: { title: '文章管理', icon: 'language' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/article/list'),
        meta: { title: '文章列表', icon: 'documentation', roles: ['admin', 'editor'] }
      },
      {
        path: 'add',
        component: () => import('@/views/article/add'),
        meta: { title: '添加文章', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'edit',
        component: () => import('@/views/article/edit'),
        meta: { title: '编辑文章', roles: ['admin'] },
        hidden: true
      }
    ]
  },

  {
    path: '/focus',
    redirect: '/focus/list',
    component: Layout,
    meta: { title: '轮播图管理', icon: 'example' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/focus/list'),
        meta: { title: '轮播图列表', icon: 'component', roles: ['admin', 'editor'] }
      },
      {
        path: 'add',
        component: () => import('@/views/focus/add'),
        meta: { title: '添加轮播图', icon: 'edit', roles: ['admin'] }
      },
      {
        path: 'edit',
        component: () => import('@/views/focus/edit'),
        meta: { title: '编辑轮播图', roles: ['admin'] },
        hidden: true
      }
    ]
  },

  {
    path: '/link',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/link/index'),
        meta: { title: '友情链接管理', icon: 'link', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    path: '/nav',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/nav/index'),
        meta: { title: '导航栏管理', icon: 'table', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    path: '/play',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/play/index'),
        meta: { title: '歌单管理', icon: 'guide', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/blog',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/blog/index'),
        meta: { title: '博客管理', icon: 'guide', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/swiper',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/swiper/index'),
        meta: { title: '轮播图管理', icon: 'guide', roles: ['admin'] }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/setting/index'),
        meta: { title: '网站设置', icon: 'guide', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
