import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '@/components/EventsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: EventsView,
    },
  ],
})

export default router
