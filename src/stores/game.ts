import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GameEngine } from '../core'

export const useGameStore = defineStore('game', () => {
  const engine = ref<GameEngine | null>(null)
  const isRunning = ref(false)

  // Computed getters
  const resources = computed(() => engine.value?.getAllResources() ?? [])
  const generators = computed(() => engine.value?.getAllGenerators() ?? [])
  const upgrades = computed(() => engine.value?.getAllUpgrades() ?? [])
  const achievements = computed(() => engine.value?.getAllAchievements() ?? [])

  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.unlocked)
  )

  const visibleUpgrades = computed(() =>
    upgrades.value.filter(u => u.isVisible())
  )

  // Actions
  function initializeGame(gameEngine: GameEngine) {
    engine.value = gameEngine
  }

  function startGame() {
    if (engine.value && !isRunning.value) {
      engine.value.start()
      isRunning.value = true
    }
  }

  function stopGame() {
    if (engine.value && isRunning.value) {
      engine.value.stop()
      isRunning.value = false
    }
  }

  function saveGame() {
    engine.value?.save()
  }

  function loadGame(): boolean {
    return engine.value?.load() ?? false
  }

  function resetGame() {
    engine.value?.reset()
  }

  function purchaseGenerator(generatorId: string, quantity: number = 1): boolean {
    if (!engine.value) return false
    
    const generator = engine.value.getGenerator(generatorId)
    if (!generator) return false

    const resourceMap = new Map(
      engine.value.getAllResources().map(r => [r.id, r])
    )

    const success = generator.purchase(resourceMap, quantity)
    if (success) {
      engine.value.statistics.recordGeneratorPurchase(generatorId, quantity)
    }
    return success
  }

  function purchaseUpgrade(upgradeId: string): boolean {
    if (!engine.value) return false
    
    const upgrade = engine.value.getUpgrade(upgradeId)
    if (!upgrade) return false

    const resourceMap = new Map(
      engine.value.getAllResources().map(r => [r.id, r])
    )

    const success = upgrade.purchase(resourceMap)
    if (success) {
      engine.value.statistics.recordUpgradePurchase(upgradeId)
    }
    return success
  }

  function getResource(id: string) {
    return engine.value?.getResource(id)
  }

  function getGenerator(id: string) {
    return engine.value?.getGenerator(id)
  }

  function getUpgrade(id: string) {
    return engine.value?.getUpgrade(id)
  }

  return {
    engine,
    isRunning,
    resources,
    generators,
    upgrades,
    achievements,
    unlockedAchievements,
    visibleUpgrades,
    initializeGame,
    startGame,
    stopGame,
    saveGame,
    loadGame,
    resetGame,
    purchaseGenerator,
    purchaseUpgrade,
    getResource,
    getGenerator,
    getUpgrade
  }
})
