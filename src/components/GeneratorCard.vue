<script setup lang="ts">
import { computed } from 'vue'
import type { Generator, Resource } from '../core'

const props = defineProps<{
  generator: Generator
  resources: Resource[]
}>()

const emit = defineEmits<{
  purchase: [generatorId: string]
}>()

const resourceMap = computed(() => 
  new Map(props.resources.map(r => [r.id, r]))
)

const canAfford = computed(() => 
  props.generator.canPurchase(resourceMap.value)
)

const costs = computed(() => {
  const costMap = props.generator.getCurrentCosts()
  return Array.from(costMap.entries()).map(([resourceId, amount]) => {
    const resource = resourceMap.value.get(resourceId)
    return {
      resourceName: resource?.name ?? resourceId,
      amount: amount.toFixed(2)
    }
  })
})

const isMaxed = computed(() => 
  props.generator.maxPurchases !== null && 
  props.generator.purchased >= props.generator.maxPurchases
)

function handlePurchase() {
  emit('purchase', props.generator.id)
}
</script>

<template>
  <div class="generator-card" :class="{ disabled: !canAfford || isMaxed }">
    <div class="generator-header">
      <h3>{{ generator.name }}</h3>
      <div class="generator-count">Owned: {{ generator.purchased }}</div>
    </div>
    
    <p v-if="generator.description" class="generator-description">
      {{ generator.description }}
    </p>

    <div class="generator-production">
      Production: {{ generator.getCurrentProduction().toFixed(2) }}/s
    </div>

    <div class="generator-costs">
      <div v-for="cost in costs" :key="cost.resourceName" class="cost-item">
        {{ cost.resourceName }}: {{ cost.amount }}
      </div>
    </div>

    <button 
      @click="handlePurchase" 
      :disabled="!canAfford || isMaxed"
      class="purchase-button"
    >
      <span v-if="isMaxed">Maxed</span>
      <span v-else>Purchase</span>
    </button>
  </div>
</template>

<style scoped>
.generator-card {
  padding: 1rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.generator-card:hover:not(.disabled) {
  border-color: #42b983;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.generator-card.disabled {
  opacity: 0.6;
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.generator-header h3 {
  margin: 0;
  color: #2c3e50;
}

.generator-count {
  font-weight: bold;
  color: #42b983;
}

.generator-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.generator-production {
  color: #42b983;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.generator-costs {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.cost-item {
  font-size: 0.9rem;
  color: #555;
}

.purchase-button {
  width: 100%;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.purchase-button:hover:not(:disabled) {
  background: #359268;
}

.purchase-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
