<script setup>

import {ref} from "vue";

const emit = defineEmits(['update:search','update:category'])
const props = defineProps({
  dataList: Array,
})

const kategorierList = ref([])

for (const item of props.dataList) {
  if (!kategorierList.value.includes(item.kategori)) {
    kategorierList.value.push(item.kategori)
  }
}


</script>

<template>
  <input type="text" placeholder="søg..." @input="emit('update:search', $event.target.value)" />
  <select @change="emit('update:category', $event.target.value)">
    <option value="">Alle</option>
    <option v-for="k in kategorierList" :key="k" :value="k">{{ k }}</option>
  </select>
</template>

<style scoped></style>
