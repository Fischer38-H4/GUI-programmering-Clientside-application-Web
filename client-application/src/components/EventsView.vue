<script setup>
import { ref, onMounted, computed } from 'vue'
import { events as dummyEvents } from '@/data/events.js'
import EventList from '@/components/EventList.vue'
import SearchFilter from '@/components/SearchFilter.vue'

const events = ref([])
const loading = ref(false)
const error = ref(null)

const searchQuery = ref('')
const kategorierQuery = ref('')
const filterEvent = ref([])
const eventData = ref(dummyEvents)
</script>

<template>
  <SearchFilter
    v-model="searchQuery"
    v-model:kategorier="kategorierQuery"
    :dataList="eventData"
    @filterEvents="filterEvent = $event"
  />
  <EventList :events="filterEvent" />
</template>
