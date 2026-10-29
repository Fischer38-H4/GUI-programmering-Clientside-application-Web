<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'create'])
const customCategoryOption = '__custom_category__'
const newEvent = ref({
  title: '',
  kategori: '',
  date: '',
  beskrivelse: '',
  sted: '',
  underviser: '',
})
const customCategory = ref('')
const errorMessage = ref('')
const categories = computed(() => [...new Set(props.events.map((event) => event.kategori))])
const isCustomCategory = computed(() => newEvent.value.kategori === customCategoryOption)

function createEvent() {
  const title = newEvent.value.title.trim()
  const kategori = isCustomCategory.value
    ? customCategory.value.trim()
    : newEvent.value.kategori.trim()
  const date = newEvent.value.date

  if (!title || !kategori || !date) {
    errorMessage.value = 'Udfyld titel, kategori og dato for at oprette arrangementet.'
    return
  }

  emit('create', {
    title,
    kategori,
    date,
    beskrivelse: newEvent.value.beskrivelse.trim(),
    sted: newEvent.value.sted.trim(),
    underviser: newEvent.value.underviser.trim(),
  })
}

function closeOnEscape(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <section
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-event-heading"
    >
      <button class="close-button" type="button" aria-label="Luk vindue" @click="emit('close')">
        &times;
      </button>
      <h2 id="create-event-heading">Opret arrangement</h2>

      <form novalidate @submit.prevent="createEvent" @input="errorMessage = ''">
        <div class="form-field">
          <label for="event-title">Titel</label>
          <input id="event-title" v-model="newEvent.title" type="text" required autofocus />
        </div>
        <div class="form-field">
          <label for="event-category">Kategori</label>
          <select id="event-category" v-model="newEvent.kategori" required>
            <option value="" disabled>Vælg en kategori</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
            <option :value="customCategoryOption">Ny kategori...</option>
          </select>
        </div>
        <div v-if="isCustomCategory" class="form-field">
          <label for="new-event-category">Ny kategori</label>
          <input
            id="new-event-category"
            v-model="customCategory"
            type="text"
            required
            autofocus
          />
        </div>
        <div class="form-field">
          <label for="event-date">Dato</label>
          <input id="event-date" v-model="newEvent.date" type="date" required />
        </div>
        <div class="form-field">
          <label for="event-description">Beskrivelse (valgfri)</label>
          <textarea id="event-description" v-model="newEvent.beskrivelse" rows="3" />
        </div>
        <div class="form-field">
          <label for="event-location">Sted (valgfrit)</label>
          <input id="event-location" v-model="newEvent.sted" type="text" />
        </div>
        <div class="form-field">
          <label for="event-instructor">Underviser (valgfri)</label>
          <input id="event-instructor" v-model="newEvent.underviser" type="text" />
        </div>

        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

        <div class="actions">
          <button type="button" @click="emit('close')">Annuller</button>
          <button type="submit">Opret arrangement</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgb(0 0 0 / 45%);
}

.modal {
  position: relative;
  width: min(100%, 28rem);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: white;
  color: #222;
  box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 25%);
}

.modal h2 {
  margin-top: 0;
  padding-right: 2rem;
}

.close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 1.5rem;
}

.form-field {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.form-field input,
.form-field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  font: inherit;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.error-message {
  color: #b00020;
}
</style>
