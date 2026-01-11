<script setup lang="ts">
import { computed } from 'vue'

interface StatisticsProps {
  statistics: {
    getStats(): any
    getTimePlayed(): number
    getTotalGeneratorsPurchased(): number
    getTotalUpgradesPurchased(): number
  }
}

const props = defineProps<StatisticsProps>()

const stats = computed(() => props.statistics.getStats())

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

const totalGenerators = computed(() => 
  props.statistics.getTotalGeneratorsPurchased()
)

const totalUpgrades = computed(() => 
  props.statistics.getTotalUpgradesPurchased()
)
</script>

<template>
  <div class="statistics-panel">
    <h2>📊 Statistics</h2>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">Time Played</div>
        <div class="stat-value">{{ formatTime(statistics.getTimePlayed()) }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Clicks</div>
        <div class="stat-value">{{ stats.totalClicks }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Generators Purchased</div>
        <div class="stat-value">{{ totalGenerators }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Upgrades Purchased</div>
        <div class="stat-value">{{ totalUpgrades }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Achievements</div>
        <div class="stat-value">{{ stats.achievementsUnlocked }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-panel {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
}

.statistics-panel h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}
</style>
