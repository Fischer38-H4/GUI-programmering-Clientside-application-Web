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
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="create-event-heading">
      <button class="close-button" type="button" aria-label="Luk vindue" @click="emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
      <p class="eyebrow">NYT ARRANGEMENT</p>
      <h2 id="create-event-heading">Opret arrangement</h2>
      <p class="modal-intro">Udfyld detaljerne og del dit arrangement med andre.</p>

      <form novalidate @submit.prevent="createEvent" @input="errorMessage = ''">
        <div class="form-grid">
          <div class="form-field form-field-wide">
            <label for="event-title">Titel <span>*</span></label>
            <input id="event-title" v-model="newEvent.title" type="text" required autofocus />
          </div>
          <div class="form-field">
            <label for="event-category">Kategori <span>*</span></label>
            <select id="event-category" v-model="newEvent.kategori" required>
              <option value="" disabled>Vælg en kategori</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option :value="customCategoryOption">Ny kategori...</option>
            </select>
          </div>
          <div v-if="isCustomCategory" class="form-field">
            <label for="new-event-category">Ny kategori <span>*</span></label>
            <input
              id="new-event-category"
              v-model="customCategory"
              type="text"
              required
              autofocus
            />
          </div>
          <div class="form-field">
            <label for="event-date">Dato <span>*</span></label>
            <input id="event-date" v-model="newEvent.date" type="date" required />
          </div>
          <div class="form-field form-field-wide">
            <label for="event-description"
              >Beskrivelse <span class="optional">(valgfri)</span></label
            >
            <textarea id="event-description" v-model="newEvent.beskrivelse" rows="3" />
          </div>
          <div class="form-field">
            <label for="event-location">Sted <span class="optional">(valgfrit)</span></label>
            <input id="event-location" v-model="newEvent.sted" type="text" />
          </div>
          <div class="form-field">
            <label for="event-instructor">Underviser <span class="optional">(valgfri)</span></label>
            <input id="event-instructor" v-model="newEvent.underviser" type="text" />
          </div>
        </div>

        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

        <div class="actions">
          <button class="cancel-button" type="button" @click="emit('close')">Annuller</button>
          <button class="submit-button" type="submit">Opret arrangement</button>
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
  overflow-y: auto;
  padding: 1.25rem;
  background: rgb(15 23 42 / 58%);
  backdrop-filter: blur(3px);
}

.modal {
  position: relative;
  width: min(100%, 42rem);
  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  color: #111827;
  box-shadow: 0 24px 70px rgb(15 23 42 / 25%);
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.13em;
}

.modal h2 {
  margin: 0;
  padding-right: 2rem;
  font-size: 1.65rem;
  letter-spacing: -0.035em;
}

.modal-intro {
  margin: 0.55rem 0 1.5rem;
  color: #64748b;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.65rem;
  background: #fff;
  color: #475569;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.close-button:hover {
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field-wide {
  grid-column: 1 / -1;
}

.form-field label {
  color: #334155;
  font-size: 0.875rem;
  font-weight: 650;
}

.form-field label > span:not(.optional) {
  color: #2563eb;
}

.form-field .optional {
  color: #94a3b8;
  font-weight: 400;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  min-height: 2.8rem;
  box-sizing: border-box;
  padding: 0.65rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  background: #fff;
  color: #111827;
  font: inherit;
}

.form-field textarea {
  min-height: auto;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: #3b82f6;
  outline: 3px solid rgb(59 130 246 / 14%);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.actions button {
  min-height: 2.75rem;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
}

.cancel-button:hover {
  background: #f8fafc;
}

.submit-button {
  border: 1px solid #1d4ed8;
  background: #2563eb;
  color: #fff;
}

.submit-button:hover {
  background: #1d4ed8;
}

.close-button:focus-visible,
.actions button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.error-message {
  margin: 1rem 0 0;
  padding: 0.75rem 0.9rem;
  border: 1px solid #fecaca;
  border-radius: 0.6rem;
  background: #fef2f2;
  color: #b91c1c;
}

@media (max-width: 560px) {
  .modal-backdrop {
    place-items: end center;
    padding: 0.5rem;
  }

  .modal {
    max-height: calc(100vh - 1rem);
    border-radius: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field-wide {
    grid-column: auto;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .actions button {
    width: 100%;
  }
}
</style>
