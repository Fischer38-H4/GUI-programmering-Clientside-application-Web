<script setup>
import { ref } from 'vue'
import { events as dummyEvents } from '@/data/events.js'
import EventList from '@/components/EventList.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import CreateEventModal from '@/components/CreateEventModal.vue'

const searchQuery = ref('')
const kategorierQuery = ref('')
const filterEvent = ref([])
const eventData = ref(dummyEvents)
const isCreateModalOpen = ref(false)
const successMessage = ref('')

function createEvent(event) {
  const id = Math.max(0, ...eventData.value.map((event) => event.id)) + 1
  eventData.value.push({ ...event,
    id,
  })
  isCreateModalOpen.value = false
  successMessage.value = 'Arrangementet er oprettet.'
}

</script>

<template>
  <main>
    <h1>Arrangementer</h1>
    <button type="button" @click="successMessage = ''; isCreateModalOpen = true">
      Nyt arrangement
    </button>
    <p v-if="successMessage" role="status">{{ successMessage }}</p>

    <SearchFilter
      v-model="searchQuery"
      v-model:kategorier="kategorierQuery"
      :dataList="eventData"
      @filterEvents="filterEvent = $event"
    />
    <EventList :events="filterEvent" />

    <CreateEventModal
      v-if="isCreateModalOpen"
      :events="eventData"
      @close="isCreateModalOpen = false"
      @create="createEvent"
    />
  </main>
</template>
