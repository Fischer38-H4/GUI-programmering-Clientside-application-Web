<script setup>
import { watch, computed } from 'vue'

const emit = defineEmits(['update:search', 'update:category', 'filterEvents'])
const searchQuery = defineModel()
const kategorierQuery = defineModel('kategorier', { default: '' })
const props = defineProps({
  dataList: Array,
  categories: {
    type: Array,
    default: () => [],
  },
})

const kategorierList = computed(
  () =>
    props.categories.length
      ? props.categories
      : [...new Set(props.dataList.map((item) => item.kategori))],
)

const filterEvents = computed(() => {
  const search = searchQuery.value.toLowerCase().trim()
  return props.dataList.filter((event) => {
    if (!event.title.toLowerCase().includes(search) && !event.sted.toLowerCase().includes(search)) {
      return false
    }
    if (kategorierQuery.value && event.kategori !== kategorierQuery.value) {
      return false
    }
    return true
  })
})

watch(filterEvents, (nyt) => emit('filterEvents', nyt), { immediate: true })
</script>

<template>
  <input v-model="searchQuery" type="text" placeholder="søg..." />
  <select v-model="kategorierQuery">
    <option value="">Alle</option>
    <option v-for="k in kategorierList" :key="k" :value="k">{{ k }}</option>
  </select>
</template>

<style scoped></style>
