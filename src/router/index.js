import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    component: () => import('@/views/HomeView.vue'),
    name: 'Home',
    path: '/',
  },
]

export const router = createRouter({
  history: import.meta.env.MODE === 'development' ? createWebHistory() : createWebHashHistory(),
  routes,
})
