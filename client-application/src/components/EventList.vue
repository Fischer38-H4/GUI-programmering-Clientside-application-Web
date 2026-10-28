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
  <p v-if="events.length === 0">Ingen events fundet</p>
  <ul v-else>
    <li v-for="event in events" :key="event.id">
      <EventCard :event="event" />
    </li>
  </ul>
</template>

<style scoped></style>
