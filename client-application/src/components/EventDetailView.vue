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
  <main class="detail-page">
    <RouterLink class="back-link" :to="{ name: 'overview' }">
      <span aria-hidden="true">←</span>
      Tilbage til oversigten
    </RouterLink>

    <p v-if="isLoadingEvents" class="state-message" role="status">Henter arrangement...</p>
    <section v-else-if="eventsError" class="state-card" aria-live="polite">
      <h1>Arrangementet kunne ikke hentes</h1>
      <p role="alert">{{ eventsError }}</p>
      <button class="primary-button" type="button" @click="fetchEvent">Prøv igen</button>
    </section>
    <section v-else-if="event" class="event-detail">
      <p class="eyebrow">{{ event.kategori }}</p>
      <h1>{{ event.title }}</h1>
      <p v-if="event.beskrivelse" class="event-description">{{ event.beskrivelse }}</p>

      <dl class="event-facts">
        <div class="event-fact">
          <dt>Dato</dt>
          <dd>{{ event.date }}</dd>
        </div>
        <div v-if="event.sted" class="event-fact">
          <dt>Sted</dt>
          <dd>{{ event.sted }}</dd>
        </div>
        <div class="event-fact">
          <dt>Kategori</dt>
          <dd>{{ event.kategori }}</dd>
        </div>
        <div v-if="event.underviser" class="event-fact">
          <dt>Underviser</dt>
          <dd>{{ event.underviser }}</dd>
        </div>
      </dl>
    </section>

    <section v-else class="state-card">
      <h1>Arrangementet blev ikke fundet</h1>
      <p>Det valgte arrangement findes ikke længere eller har et ugyldigt link.</p>
      <RouterLink class="primary-button" :to="{ name: 'overview' }">
        Se alle arrangementer
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.detail-page {
  box-sizing: border-box;
  width: min(100% - 2rem, 920px);
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4rem) 0;
  color: #111827;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: #1d4ed8;
}

.back-link:focus-visible,
.primary-button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.event-detail {
  margin-top: 1.5rem;
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 12px 35px rgb(15 23 42 / 5%);
}

.eyebrow {
  margin: 0 0 0.65rem;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.event-detail h1,
.state-card h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.event-description {
  max-width: 65ch;
  margin: 1rem 0 0;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
}

.event-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 0.75rem;
  margin: 2rem 0 0;
}

.event-fact {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.event-fact dt {
  margin-bottom: 0.35rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-fact dd {
  margin: 0;
  color: #111827;
  font-weight: 650;
}

.state-message,
.state-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  color: #475569;
}

.state-card p {
  line-height: 1.6;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.6rem 1rem;
  border: 1px solid #1d4ed8;
  border-radius: 0.65rem;
  background: #2563eb;
  color: #fff;
  font: inherit;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
}

.primary-button:hover {
  background: #1d4ed8;
}
</style>
