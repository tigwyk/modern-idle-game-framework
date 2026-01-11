<script setup lang="ts">
import type { Resource } from '../core'

defineProps<{
  resource: Resource
}>()
</script>

<template>
  <div
    class="resource-display"
    role="status"
    aria-live="polite"
    :aria-label="`${resource.name}: ${resource.getDisplayAmount()}`"
  >
    <div class="resource-name">{{ resource.name }}</div>
    <div class="resource-amount">{{ resource.getDisplayAmount() }}</div>
    <div v-if="resource.description" class="resource-description">
      {{ resource.description }}
    </div>
  </div>
</template>

<style scoped>
.resource-display {
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.resource-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.resource-amount {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.resource-description {
  font-size: 0.9rem;
  color: #666;
}
</style>
