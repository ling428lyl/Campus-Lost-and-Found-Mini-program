import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("../views/Login.vue")
  },
  {
    path: '/home',
    name: 'home',
    component: () => import("../views/Home.vue"),
    redirect:'/found',
    children: [
      {
        path: '/lost',
        name: 'lost',
        component: () => import("../views/Lost.vue"),
      },
      {
        path: '/found',
        name: 'found',
        component: () => import("../views/Found.vue"),
      },
      {
        path: '/user',
        name: 'user',
        component: () => import("../views/User.vue"),
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import("../views/Admin.vue"),
      },
      {
        path: '/classify',
        name: 'classify',
        component: () => import("../views/Classify.vue"),
      },
      
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
