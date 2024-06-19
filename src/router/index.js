import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    component: () => import('@/views/HomeView.vue'),
    meta: {
      hasDarkMode: false,
    },
    name: '1.0',
    path: '/',
  },
  {
    component: () => import('@/views/NewView.vue'),
    meta: {
      hasDarkMode: true,
    },
    name: '2.0',
    path: '/2.0',
  },
]

export const router = createRouter({
  history: import.meta.env.MODE === 'development' ? createWebHistory() : createWebHashHistory(),
  routes,
})
