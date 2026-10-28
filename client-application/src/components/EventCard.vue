<script setup>
defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="event-card">
    <h3>{{ event.title }}</h3>
    <p>{{ event.sted }} · {{ event.date }}</p>
    <p>{{ event.beskrivelse }}</p>
    <p>{{ event.underviser }} · {{ event.kategori }}</p>
  </article>
</template>

<style scoped>
.event-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}
</style>
