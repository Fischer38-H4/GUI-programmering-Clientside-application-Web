<script setup>
import {ref, onMounted, computed} from "vue";
  import { events as dummyEvents } from "@/data/events.js";
  import EventList from "@/components/EventList.vue";
  import SearchFilter from "@/components/SearchFilter.vue";

  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const search = ref("");
  const category = ref("");
  const s = ref(["Kunst", "Musik", "Teater", "Dans", "Film"]);
  const eventData = ref(dummyEvents);

  const filterEvents = computed(() => {
    const esearch = search.value.toLowerCase().trim();
    return eventData.value.filter((event) => {
      if (event.title.toLowerCase().includes(esearch)) {
        return true;
      }
      if (event.sted.toLowerCase().includes(esearch)) {
        return true;
      }
      return false;
    });
  });

</script>

<template>
  <SearchFilter
    v-model:search="search"
    v-model:category="category"
    :categories="s"
  />
  <EventList :events="filterEvents"/>
</template>

<style scoped>

</style>
