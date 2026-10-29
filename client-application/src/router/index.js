import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '@/components/EventsView.vue'
import EventDetailView from '@/components/EventDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: EventsView,
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      component: EventDetailView,
    },
  ],
})

export default router
