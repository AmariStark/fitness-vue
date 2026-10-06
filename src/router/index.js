import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import('../views/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    redirect: "/home/index",
    children: [
      {
        path: "index",
        name: "index",
        component: () => import('../views/dashboard.vue')
      },
      {
        path: "course",
        name: "course",
        component: () => import('../views/CourseView.vue')
      },
      {
        path: "user",
        name: "user",
        component: () => import('../views/UserView.vue')
      },
    ]
  },
  {
    path: "/about",
    name: "about",
    component: () => import('../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 全局前置守卫：未登录只能进登录页，已登录则补全用户信息
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login') {
    // 已登录就不用再看登录页了
    return token ? next('/home') : next()
  }

  if (!token) {
    return next('/login')
  }

  // 用户信息已加载过就不再重复请求
  if (store.state.user.name) {
    return next()
  }

  try {
    await store.dispatch('user/getPerson')
    next()
  } catch (e) {
    // token 失效：清掉登录态，回到登录页
    store.commit('user/REMOVE_TOKEN')
    next('/login')
  }
})

export default router
