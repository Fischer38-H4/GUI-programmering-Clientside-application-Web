<script setup>
  const search = defineModel('search',{default: ""})
  const category = defineModel('category',{default: ""})
  defineProps({
    categories: {
      type: Array,
      required: false
    }
  })
</script>

<template>
  <input v-model="search" type="search" placeholder="søg..." />
  <select v-model="category">
    <option value="">Alle</option>
    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
  </select>
</template>

<style scoped>

</style>
