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

const kategorierList = computed(() =>
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
  <div class="search-filters">
    <label class="search-field">
      <span class="visually-hidden">Søg efter arrangement eller sted</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input v-model="searchQuery" type="search" placeholder="Søg efter arrangement..." />
    </label>
    <label class="category-field">
      <span class="visually-hidden">Filtrér efter kategori</span>
      <select v-model="kategorierQuery">
        <option value="">Alle kategorier</option>
        <option v-for="k in kategorierList" :key="k" :value="k">{{ k }}</option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.search-filters {
  display: flex;
  flex: 1;
  gap: 0.75rem;
  min-width: 0;
}

.search-field,
.category-field {
  display: flex;
  align-items: center;
  min-height: 2.85rem;
  border: 1px solid #dbe3ee;
  border-radius: 0.65rem;
  background: #fff;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.search-field {
  flex: 1;
  gap: 0.65rem;
  min-width: 8rem;
  padding: 0 0.85rem;
}

.search-field:focus-within,
.category-field:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 14%);
}

.search-field svg {
  width: 1.15rem;
  flex: 0 0 auto;
  fill: none;
  stroke: #64748b;
  stroke-linecap: round;
  stroke-width: 1.8;
}

.search-field input,
.category-field select {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font: inherit;
}

.search-field input::placeholder {
  color: #94a3b8;
}

.category-field {
  flex: 0 0 auto;
  padding: 0 0.8rem;
}

.category-field select {
  cursor: pointer;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 600px) {
  .search-filters {
    flex-direction: column;
  }

  .category-field {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
