<script setup>
import EventCard from '@/components/EventCard.vue'

defineProps({
  events: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <p v-if="events.length === 0" class="empty-state">
    Ingen arrangementer fundet. Prøv at ændre din søgning.
  </p>
  <ul v-else class="event-list">
    <li v-for="event in events" :key="event.id">
      <EventCard :event="event" />
    </li>
  </ul>
</template>

<style scoped>
.event-list {
  display: grid;
  gap: 0.75rem;
  margin: 1.15rem 0 0;
  padding: 0;
  list-style: none;
}

.empty-state {
  margin: 1.15rem 0 0;
  padding: 2rem 1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 0.8rem;
  color: #64748b;
  text-align: center;
}
</style>
