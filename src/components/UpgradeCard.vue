<script setup lang="ts">
import { computed } from 'vue'
import type { Upgrade, Resource } from '../core'

const props = defineProps<{
  upgrade: Upgrade
  resources: Resource[]
}>()

const emit = defineEmits<{
  purchase: [upgradeId: string]
}>()

const resourceMap = computed(() => 
  new Map(props.resources.map(r => [r.id, r]))
)

const canAfford = computed(() => 
  props.upgrade.canPurchase(resourceMap.value)
)

const costs = computed(() => {
  return props.upgrade.costs.map(cost => {
    const resource = resourceMap.value.get(cost.resourceId)
    return {
      resourceName: resource?.name ?? cost.resourceId,
      amount: cost.amount.toFixed(2)
    }
  })
})

const isMaxed = computed(() => props.upgrade.isMaxed())

function handlePurchase() {
  emit('purchase', props.upgrade.id)
}
</script>

<template>
  <div class="upgrade-card" :class="{ disabled: !canAfford || isMaxed }">
    <div class="upgrade-header">
      <h3 id="upgrade-{{ upgrade.id }}-name">{{ upgrade.name }}</h3>
      <div v-if="upgrade.maxPurchases > 1" class="upgrade-count">
        {{ upgrade.purchased }}/{{ upgrade.maxPurchases }}
      </div>
    </div>
    
    <p class="upgrade-description">{{ upgrade.description }}</p>

    <div class="upgrade-costs" role="group" aria-label="Cost">
      <div v-for="cost in costs" :key="cost.resourceName" class="cost-item">
        {{ cost.resourceName }}: {{ cost.amount }}
      </div>
    </div>

    <button 
      @click="handlePurchase" 
      :disabled="!canAfford || isMaxed"
      :aria-labelledby="`upgrade-${upgrade.id}-name`"
      :aria-label="`Purchase ${upgrade.name} upgrade for ${costs.map(c => c.amount + ' ' + c.resourceName).join(', ')}`"
      class="purchase-button"
    >
      <span v-if="isMaxed">Purchased</span>
      <span v-else>Purchase</span>
    </button>
  </div>
</template>

<style scoped>
.upgrade-card {
  padding: 1rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.upgrade-card:hover:not(.disabled) {
  border-color: #f39c12;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upgrade-card.disabled {
  opacity: 0.6;
}

.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.upgrade-header h3 {
  margin: 0;
  color: #2c3e50;
}

.upgrade-count {
  font-weight: bold;
  color: #f39c12;
}

.upgrade-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.upgrade-costs {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #fff9e6;
  border-radius: 4px;
}

.cost-item {
  font-size: 0.9rem;
  color: #555;
}

.purchase-button {
  width: 100%;
  padding: 0.75rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.purchase-button:hover:not(:disabled) {
  background: #d68910;
}

.purchase-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
