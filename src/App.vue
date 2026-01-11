<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/game'
import { createSpaceMiningGame } from './games/spaceMiningGame'
import ResourceDisplay from './components/ResourceDisplay.vue'
import GeneratorCard from './components/GeneratorCard.vue'
import UpgradeCard from './components/UpgradeCard.vue'
import AchievementCard from './components/AchievementCard.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'

const gameStore = useGameStore()

onMounted(() => {
  const engine = createSpaceMiningGame()
  gameStore.initializeGame(engine)
  gameStore.loadGame()
  gameStore.startGame()
})

onUnmounted(() => {
  gameStore.stopGame()
  gameStore.saveGame()
})

function handleManualClick() {
  const minerals = gameStore.getResource('minerals')
  if (minerals) {
    minerals.add(1)
    // Track the click and resource earned in statistics
    gameStore.engine?.statistics.recordClick()
    gameStore.engine?.statistics.recordResourceEarned('minerals', 1)
  }
}
</script>

<template>
  <div class="game-container">
    <header>
      <h1>🚀 Space Mining Empire</h1>
      <p class="subtitle">Built with the Modern Idle Game Framework</p>
    </header>

    <div class="game-content">
      <aside class="sidebar">
        <section class="resources-section">
          <h2>Resources</h2>
          <ResourceDisplay
            v-for="resource in gameStore.resources"
            :key="resource.id"
            :resource="resource"
          />
          <button @click="handleManualClick" class="click-button" aria-label="Click to mine minerals">
            ⛏️ Mine Minerals
          </button>
        </section>

        <section class="achievements-section">
          <h2>Achievements ({{ gameStore.unlockedAchievements.length }}/{{ gameStore.achievements.length }})</h2>
          <div class="achievements-list" role="list" aria-label="Achievements">
            <AchievementCard
              v-for="achievement in gameStore.achievements"
              :key="achievement.id"
              :achievement="achievement"
            />
          </div>
        </section>

        <StatisticsPanel 
          v-if="gameStore.engine?.statistics"
          :statistics="gameStore.engine.statistics"
        />
      </aside>

      <main class="main-content">
        <section class="generators-section">
          <h2>Generators</h2>
          <GeneratorCard
            v-for="generator in gameStore.generators"
            :key="generator.id"
            :generator="generator"
            :resources="gameStore.resources"
            @purchase="(id, qty) => gameStore.purchaseGenerator(id, qty)"
          />
        </section>

        <section class="upgrades-section">
          <h2>Upgrades</h2>
          <div v-if="gameStore.visibleUpgrades.length === 0" class="empty-state">
            Purchase generators to unlock upgrades!
          </div>
          <UpgradeCard
            v-for="upgrade in gameStore.visibleUpgrades"
            :key="upgrade.id"
            :upgrade="upgrade"
            :resources="gameStore.resources"
            @purchase="gameStore.purchaseUpgrade"
          />
        </section>
      </main>
    </div>

    <footer>
      <button @click="gameStore.saveGame()" class="action-button" aria-label="Save game progress">💾 Save Game</button>
      <button @click="gameStore.resetGame()" class="action-button danger" aria-label="Reset game (warning: this will delete all progress)">🔄 Reset Game</button>
    </footer>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  margin: 0.5rem 0 0 0;
}

.game-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.click-button {
  width: 100%;
  padding: 2rem;
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  color: white;
}

.click-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.click-button:active {
  transform: scale(0.95);
}

.achievements-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 2px solid #ddd;
}

.action-button {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #359268;
}

.action-button.danger {
  background: #e74c3c;
}

.action-button.danger:hover {
  background: #c0392b;
}

@media (max-width: 900px) {
  .game-content {
    grid-template-columns: 1fr;
  }
}
</style>
