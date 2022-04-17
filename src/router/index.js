import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'userIndex',
    component: () => import('../views/users/Index.vue'),
  },
  {
    path: '/create',
    name: 'userCreate',
    component: () => import('../views/users/Create.vue'),
  },
  {
    path: '/:id/edit',
    name: 'userEdit',
    component: () => import('../views/users/Create.vue'),
  },
  {
    path: '/:id',
    name: 'userView',
    component: () => import('../views/users/View.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
