<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { events } from '@/data/events.js'

const route = useRoute()
const event = computed(() => events.find((item) => item.id === Number(route.params.id)))
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'overview' }">← Tilbage til oversigten</RouterLink>

    <section v-if="event" class="event-detail">
      <h1>{{ event.title }}</h1>
      <p v-if="event.beskrivelse">{{ event.beskrivelse }}</p>

      <dl>
        <div>
          <dt>Dato</dt>
          <dd>{{ event.date }}</dd>
        </div>
        <div v-if="event.sted">
          <dt>Sted</dt>
          <dd>{{ event.sted }}</dd>
        </div>
        <div>
          <dt>Kategori</dt>
          <dd>{{ event.kategori }}</dd>
        </div>
        <div v-if="event.underviser">
          <dt>Underviser</dt>
          <dd>{{ event.underviser }}</dd>
        </div>
      </dl>
    </section>

    <section v-else>
      <h1>Arrangementet blev ikke fundet</h1>
      <p>Det valgte arrangement findes ikke længere eller har et ugyldigt link.</p>
    </section>
  </main>
</template>

<style scoped>
.event-detail {
  max-width: 48rem;
  margin-top: 2rem;
}

dl > div {
  margin-top: 1rem;
}

dt {
  font-weight: bold;
}

dd {
  margin-left: 0;
}
</style>
