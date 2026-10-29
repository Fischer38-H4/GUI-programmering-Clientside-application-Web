<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'event-detail', params: { id: event.id } }"
    class="event-card"
    :aria-label="`Vis detaljer for ${event.title}`"
  >
    <article>
      <div class="event-heading">
        <h3>{{ event.title }}</h3>
        <p class="event-meta">
          <span v-if="event.sted" class="event-location">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            {{ event.sted }}
          </span>
          <span class="event-date">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="6" width="16" height="14" rx="2" />
              <path d="M8 3v6m8-6v6M4 11h16" />
            </svg>
            {{ event.date }}
          </span>
        </p>
      </div>
      <p v-if="event.beskrivelse" class="event-description">{{ event.beskrivelse }}</p>
      <p class="event-category">
        <span>{{ event.kategori }}</span>
        <template v-if="event.underviser"> · {{ event.underviser }}</template>
      </p>
    </article>
  </RouterLink>
</template>

<style scoped>
.event-card {
  display: block;
  padding: 1.15rem 1.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.8rem;
  background: #fff;
  color: #111827;
  text-decoration: none;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.event-card:hover,
.event-card:focus-visible {
  border-color: #93c5fd;
  box-shadow: 0 8px 20px rgb(15 23 42 / 7%);
  transform: translateY(-1px);
}

.event-card:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 2px;
}

.event-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
}

.event-heading h3 {
  min-width: 0;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.event-meta {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin: 0;
  color: #475569;
  font-size: 0.875rem;
}

.event-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.event-meta svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: #2563eb;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.event-description {
  display: -webkit-box;
  overflow: hidden;
  margin: 0.7rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.event-category {
  margin: 0.75rem 0 0;
  color: #64748b;
  font-size: 0.8rem;
}

.event-category span {
  color: #1d4ed8;
  font-weight: 650;
}

@media (max-width: 600px) {
  .event-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.45rem;
  }

  .event-meta {
    justify-content: flex-start;
  }
}
</style>
