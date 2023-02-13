import Vue from 'vue'
import VueRouter from 'vue-router'

// for implement permission menu

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home')
  },
  {
    path: '/select-frame',
    component: () => import('@/views/Frame')
  },
  {
    path: '/camera',
    component: () => import('@/views/Camera')
  },
  {
    path: '/print',
    component: () => import('@/views/Print')
  },
  {
    path: '/form/:id',
    component: () => import('@/views/Form')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
