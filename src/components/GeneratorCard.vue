<script setup lang="ts">
import { computed } from 'vue'
import type { Generator, Resource } from '../core'

const props = defineProps<{
  generator: Generator
  resources: Resource[]
}>()

const emit = defineEmits<{
  purchase: [generatorId: string, quantity: number]
}>()

const resourceMap = computed(() => 
  new Map(props.resources.map(r => [r.id, r]))
)

const canAfford = computed(() => 
  props.generator.canPurchase(resourceMap.value, 1)
)

const maxAffordable = computed(() =>
  props.generator.getMaxAffordable(resourceMap.value)
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

// Computed ARIA labels
const ownedAriaLabel = computed(() => 
  `Owned ${props.generator.purchased} ${props.generator.name}`
)

const productionAriaLabel = computed(() => 
  `Producing ${props.generator.getCurrentProduction().toFixed(2)} per second`
)

const buyOneAriaLabel = computed(() => 
  `Purchase one ${props.generator.name} for ${costs.value.map(c => c.amount + ' ' + c.resourceName).join(', ')}`
)

const buyTenAriaLabel = computed(() => 
  `Purchase 10 ${props.generator.name}s`
)

const buyHundredAriaLabel = computed(() => 
  `Purchase 100 ${props.generator.name}s`
)

const buyMaxAriaLabel = computed(() => 
  `Purchase maximum ${maxAffordable.value} ${props.generator.name}s`
)

function handlePurchase(quantity: number = 1) {
  emit('purchase', props.generator.id, quantity)
}
</script>

<template>
  <div class="generator-card" :class="{ disabled: !canAfford || isMaxed }">
    <div class="generator-header">
      <h3 :id="`generator-${generator.id}-name`">{{ generator.name }}</h3>
      <div class="generator-count" :aria-label="ownedAriaLabel">
        Owned: {{ generator.purchased }}
      </div>
    </div>
    
    <p v-if="generator.description" class="generator-description">
      {{ generator.description }}
    </p>

    <div class="generator-production" :aria-label="productionAriaLabel">
      Production: {{ generator.getCurrentProduction().toFixed(2) }}/s
    </div>

    <div class="generator-costs" role="group" aria-label="Cost">
      <div v-for="cost in costs" :key="cost.resourceName" class="cost-item">
        {{ cost.resourceName }}: {{ cost.amount }}
      </div>
    </div>

    <div class="purchase-buttons" role="group" :aria-labelledby="`generator-${generator.id}-name`">
      <button 
        @click="handlePurchase(1)" 
        :disabled="!canAfford || isMaxed"
        :aria-label="buyOneAriaLabel"
        class="purchase-button"
      >
        <span v-if="isMaxed">Maxed</span>
        <span v-else>Buy 1</span>
      </button>
      <button 
        v-if="maxAffordable >= 10"
        @click="handlePurchase(10)" 
        :disabled="maxAffordable < 10 || isMaxed"
        :aria-label="buyTenAriaLabel"
        class="purchase-button bulk"
      >
        Buy 10
      </button>
      <button 
        v-if="maxAffordable >= 100"
        @click="handlePurchase(100)" 
        :disabled="maxAffordable < 100 || isMaxed"
        :aria-label="buyHundredAriaLabel"
        class="purchase-button bulk"
      >
        Buy 100
      </button>
      <button 
        v-if="maxAffordable >= 1"
        @click="handlePurchase(maxAffordable)" 
        :disabled="maxAffordable < 1 || isMaxed"
        :aria-label="buyMaxAriaLabel"
        class="purchase-button max"
      >
        Buy Max ({{ maxAffordable }})
      </button>
    </div>
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

.purchase-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.purchase-button {
  flex: 1;
  min-width: 60px;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.purchase-button.bulk {
  background: #3498db;
}

.purchase-button.max {
  background: #9b59b6;
}

.purchase-button:hover:not(:disabled) {
  background: #359268;
}

.purchase-button.bulk:hover:not(:disabled) {
  background: #2980b9;
}

.purchase-button.max:hover:not(:disabled) {
  background: #8e44ad;
}

.purchase-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
