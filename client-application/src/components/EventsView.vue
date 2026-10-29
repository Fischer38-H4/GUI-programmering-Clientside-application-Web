<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { events as dummyEvents } from '@/data/events.js'
import { USE_DUMMY_DATA } from '@/dataSource.js'
import EventList from '@/components/EventList.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import CreateEventModal from '@/components/CreateEventModal.vue'

const searchQuery = ref('')
const kategorierQuery = ref('')
const filterEvent = ref([])
const eventData = ref([])
const availableCategories = computed(() => {
  const allEvents = USE_DUMMY_DATA ? [...dummyEvents, ...eventData.value] : eventData.value
  return [...new Set(allEvents.map((event) => event.kategori))]
})
const isLoadingEvents = ref(false)
const eventsError = ref('')
const currentPage = ref(1)
const pageSize = 10
const totalEvents = ref(0)
const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize))
const hasActiveFilters = computed(
  () => Boolean(searchQuery.value.trim()) || Boolean(kategorierQuery.value),
)
const isCreateModalOpen = ref(false)
const successMessage = ref('')

onMounted(fetchEvents)

watch([searchQuery, kategorierQuery], () => {
  if (currentPage.value !== 1) fetchEvents(1)
})

async function fetchEvents(page = currentPage.value) {
  currentPage.value = page
  isLoadingEvents.value = true
  eventsError.value = ''

  try {
    if (USE_DUMMY_DATA) {
      totalEvents.value = dummyEvents.length
      eventData.value = dummyEvents.slice((page - 1) * pageSize, page * pageSize)
      return
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${pageSize}&_page=${page}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const posts = await response.json()
    const count = Number(response.headers.get('X-Total-Count'))
    if (!Array.isArray(posts) || !Number.isFinite(count)) {
      throw new Error('API-svaret var ikke en liste')
    }

    totalEvents.value = count
    eventData.value = posts.map((post) => ({
      id: post.id,
      title: post.title,
      kategori: 'Kursus',
      date: 'Dato ikke angivet',
      beskrivelse: post.body,
      sted: 'Online',
    }))
  } catch (error) {
    console.error('Kunne ikke hente arrangementer:', error)
    eventsError.value =
      'Arrangementerne kunne ikke hentes. Kontrollér din internetforbindelse, og prøv igen.'
  } finally {
    isLoadingEvents.value = false
  }
}

function changePage(page) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  fetchEvents(page)
}

function createEvent(event) {
  const id = Math.max(0, ...eventData.value.map((event) => event.id)) + 1
  eventData.value.push({ ...event, id })
  isCreateModalOpen.value = false
  successMessage.value = 'Arrangementet er oprettet.'
}

function openCreateModal() {
  successMessage.value = ''
  isCreateModalOpen.value = true
}
</script>

<template>
  <main class="events-page">
    <header class="page-header">
      <p class="eyebrow">FIND DIT NÆSTE EVENT</p>
      <h1>Arrangementer</h1>
      <p class="page-intro">Gå på opdagelse i kommende kurser og events.</p>
    </header>
    <p v-if="successMessage" role="status">{{ successMessage }}</p>

    <p v-if="isLoadingEvents" role="status">Henter arrangementer...</p>
    <section v-else-if="eventsError" aria-live="polite">
      <p role="alert">{{ eventsError }}</p>
      <button type="button" @click="fetchEvents">Prøv igen</button>
    </section>
    <template v-else>
      <section class="event-browser" aria-label="Find arrangementer">
        <div class="toolbar">
          <SearchFilter
            v-model="searchQuery"
            v-model:kategorier="kategorierQuery"
            :dataList="eventData"
            :categories="availableCategories"
            @filterEvents="filterEvent = $event"
          />
          <button
            class="create-event-button"
            type="button"
            :disabled="isLoadingEvents || Boolean(eventsError)"
            @click="openCreateModal"
          >
            <span aria-hidden="true">+</span>
            Nyt arrangement
          </button>
        </div>
        <p v-if="hasActiveFilters">
          Søgning og kategori filtrerer kun arrangementerne på den aktuelle side.
        </p>
        <EventList :events="filterEvent" />
        <nav
          v-if="totalPages > 1 && !hasActiveFilters"
          class="pagination"
          aria-label="Sidenavigation"
        >
          <button
            type="button"
            :disabled="isLoadingEvents || currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Forrige
          </button>
          <span aria-live="polite">Side {{ currentPage }} af {{ totalPages }}</span>
          <button
            type="button"
            :disabled="isLoadingEvents || currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Næste
          </button>
        </nav>
      </section>
    </template>

    <CreateEventModal
      v-if="isCreateModalOpen"
      :events="eventData"
      @close="isCreateModalOpen = false"
      @create="createEvent"
    />
  </main>
</template>

<style scoped>
.events-page {
  box-sizing: border-box;
  width: min(100% - 2rem, 920px);
  margin: 0 auto;
  padding: clamp(2.5rem, 7vw, 5rem) 0;
  color: #111827;
}

.page-header {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.14em;
}

.page-header h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.045em;
}

.page-intro {
  margin: 0.65rem 0 0;
  color: #64748b;
  font-size: 1.05rem;
}

.event-browser {
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 12px 35px rgb(15 23 42 / 5%);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.create-event-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.85rem;
  padding: 0.65rem 1rem;
  border: 1px solid #1d4ed8;
  border-radius: 0.65rem;
  background: #2563eb;
  color: #fff;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    transform 150ms ease;
}

.create-event-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.create-event-button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.create-event-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.create-event-button span {
  font-size: 1.25rem;
  line-height: 1;
}

.event-browser > p {
  margin: 0.8rem 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

@media (max-width: 600px) {
  .event-browser {
    padding: 0.85rem;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 0.75rem;
  }

  .create-event-button {
    width: 100%;
  }
}
</style>
