<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { events as dummyEvents } from '@/data/events.js'
import EventList from '@/components/EventList.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import CreateEventModal from '@/components/CreateEventModal.vue'

const useApi = false // Set to false to use local dummy data during development.
const searchQuery = ref('')
const kategorierQuery = ref('')
const filterEvent = ref([])
const eventData = ref([])
const availableCategories = computed(() => {
  const allEvents = useApi ? eventData.value : [...dummyEvents, ...eventData.value]
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
    if (!useApi) {
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

</script>

<template>
  <main>
    <h1>Arrangementer</h1>
    <button
      type="button"
      :disabled="isLoadingEvents || Boolean(eventsError)"
      @click="successMessage = ''; isCreateModalOpen = true"
    >
      Nyt arrangement
    </button>
    <p v-if="successMessage" role="status">{{ successMessage }}</p>

    <p v-if="isLoadingEvents" role="status">Henter arrangementer...</p>
    <section v-else-if="eventsError" aria-live="polite">
      <p role="alert">{{ eventsError }}</p>
      <button type="button" @click="fetchEvents">Prøv igen</button>
    </section>
    <template v-else>
      <SearchFilter
        v-model="searchQuery"
        v-model:kategorier="kategorierQuery"
        :dataList="eventData"
        :categories="availableCategories"
        @filterEvents="filterEvent = $event"
      />
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
.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}
</style>
