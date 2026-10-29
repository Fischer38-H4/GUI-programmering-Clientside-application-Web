<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const event = ref(null)
const isLoadingEvents = ref(false)
const eventsError = ref('')

onMounted(fetchEvent)

async function fetchEvent() {
  isLoadingEvents.value = true
  eventsError.value = ''
  event.value = null

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${Number(route.params.id)}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const post = await response.json()
    if (!post || !post.id) {
      throw new Error('API-svaret indeholdt ikke et arrangement')
    }

    event.value = {
      id: post.id,
      title: post.title,
      kategori: 'Kursus',
      date: 'Dato ikke angivet',
      beskrivelse: post.body,
      sted: 'Online',
    }
  } catch (error) {
    console.error('Kunne ikke hente arrangementet:', error)
    eventsError.value =
      'Arrangementet kunne ikke hentes. Kontrollér din internetforbindelse, og prøv igen.'
  } finally {
    isLoadingEvents.value = false
  }
}
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'overview' }">← Tilbage til oversigten</RouterLink>

    <p v-if="isLoadingEvents" role="status">Henter arrangement...</p>
    <section v-else-if="eventsError" aria-live="polite">
      <h1>Arrangementet kunne ikke hentes</h1>
      <p role="alert">{{ eventsError }}</p>
      <button type="button" @click="fetchEvent">Prøv igen</button>
    </section>
    <section v-else-if="event" class="event-detail">
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
