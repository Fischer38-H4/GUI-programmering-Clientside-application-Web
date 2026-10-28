<script setup>
import { ref, onMounted, computed } from 'vue'
import { events as dummyEvents } from '@/data/events.js'
import EventList from '@/components/EventList.vue'
import SearchFilter from '@/components/SearchFilter.vue'

const events = ref([])
const loading = ref(false)
const error = ref(null)

const search = ref('')
const category = ref('')
const s = ref(['Programming', 'Design', 'Data Science', 'Dans', 'Film'])
const eventData = ref(dummyEvents)
const test = ref('test')

const filterEvents = computed(() => {
  const esearch = search.value.toLowerCase().trim()
  return eventData.value.filter((event) => {
    if (!event.title.toLowerCase().includes(esearch) && !event.sted.toLowerCase().includes(esearch)) {
      return false
    }

    if (category.value && event.kategori !== category.value) {
      return false
    }
    return true
  })
})
</script>

<template>
  <SearchFilter
    @update:search="search = $event"
    @update:category="category = $event"
    :dataList="eventData"
  />
  <EventList :events="filterEvents" />
</template>
