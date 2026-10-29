<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'event-detail', params: { id: event.id } }"
    class="event-card"
    :aria-label="`Vis detaljer for ${event.title}`"
  >
    <article>
      <h3>{{ event.title }}</h3>
      <p>{{ event.sted }} · {{ event.date }}</p>
      <p>{{ event.beskrivelse }}</p>
      <p>{{ event.underviser }} · {{event.kategori}}</p>
    </article>
  </RouterLink>
</template>

<style scoped>
.event-card {
  display: block;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  color: inherit;
  text-decoration: none;
}

.event-card:hover,
.event-card:focus-visible {
  border-color: #555;
}
</style>
