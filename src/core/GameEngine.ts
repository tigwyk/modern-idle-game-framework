import { Resource } from './Resource'
import { Generator } from './Generator'
import { Upgrade } from './Upgrade'
import { Achievement } from './Achievement'
import { StatisticsTracker } from './Statistics'

export interface GameEngineConfig {
  tickRate?: number
  autoSaveInterval?: number
}

export class GameEngine {
  private resources: Map<string, Resource> = new Map()
  private generators: Map<string, Generator> = new Map()
  private upgrades: Map<string, Upgrade> = new Map()
  private achievements: Map<string, Achievement> = new Map()
  public statistics: StatisticsTracker

  private tickRate: number
  private autoSaveInterval: number
  private lastTick: number = Date.now()
  private lastSave: number = Date.now()
  private tickInterval: number | null = null

  constructor(config: GameEngineConfig = {}) {
    this.tickRate = config.tickRate ?? 100 // 100ms = 10 ticks per second
    this.autoSaveInterval = config.autoSaveInterval ?? 30000 // 30 seconds
    this.statistics = new StatisticsTracker()
  }

  // Resource management
  addResource(resource: Resource): void {
    this.resources.set(resource.id, resource)
  }

  getResource(id: string): Resource | undefined {
    return this.resources.get(id)
  }

  getAllResources(): Resource[] {
    return Array.from(this.resources.values())
  }

  // Generator management
  addGenerator(generator: Generator): void {
    this.generators.set(generator.id, generator)
  }

  getGenerator(id: string): Generator | undefined {
    return this.generators.get(id)
  }

  getAllGenerators(): Generator[] {
    return Array.from(this.generators.values())
  }

  // Upgrade management
  addUpgrade(upgrade: Upgrade): void {
    this.upgrades.set(upgrade.id, upgrade)
  }

  getUpgrade(id: string): Upgrade | undefined {
    return this.upgrades.get(id)
  }

  getAllUpgrades(): Upgrade[] {
    return Array.from(this.upgrades.values())
  }

  // Achievement management
  addAchievement(achievement: Achievement): void {
    this.achievements.set(achievement.id, achievement)
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id)
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  // Game loop
  start(): void {
    if (this.tickInterval !== null) {
      return
    }

    this.lastTick = Date.now()
    this.lastSave = Date.now()

    this.tickInterval = window.setInterval(() => {
      this.tick()
    }, this.tickRate)
  }

  stop(): void {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
  }

  private tick(): void {
    const now = Date.now()
    const deltaTime = (now - this.lastTick) / 1000 // Convert to seconds
    this.lastTick = now

    // Process generators
    for (const generator of this.generators.values()) {
      const production = generator.getCurrentProduction() * deltaTime
      const resource = this.resources.get(generator.producesResourceId)
      if (resource && production > 0) {
        resource.add(production)
        this.statistics.recordResourceEarned(generator.producesResourceId, production)
      }
    }

    // Check achievements
    for (const achievement of this.achievements.values()) {
      const wasUnlocked = achievement.unlocked
      if (achievement.check() && !wasUnlocked) {
        this.statistics.recordAchievementUnlocked()
      }
    }

    // Auto-save
    if (now - this.lastSave >= this.autoSaveInterval) {
      this.save()
      this.lastSave = now
    }
  }

  // Save/Load
  save(): void {
    this.statistics.updateTimePlayed()

    const saveData = {
      resources: Array.from(this.resources.values()).map(r => r.toJSON()),
      generators: Array.from(this.generators.values()).map(g => g.toJSON()),
      upgrades: Array.from(this.upgrades.values()).map(u => u.toJSON()),
      achievements: Array.from(this.achievements.values()).map(a => a.toJSON()),
      statistics: this.statistics.toJSON(),
      timestamp: Date.now(),
    }

    localStorage.setItem('idleGameSave', JSON.stringify(saveData))
  }

  load(): boolean {
    const saveDataStr = localStorage.getItem('idleGameSave')
    if (!saveDataStr) {
      return false
    }

    try {
      const saveData = JSON.parse(saveDataStr)

      // Load resources
      for (const resourceData of saveData.resources) {
        const resource = this.resources.get(resourceData.id)
        resource?.fromJSON(resourceData)
      }

      // Load generators
      for (const generatorData of saveData.generators) {
        const generator = this.generators.get(generatorData.id)
        generator?.fromJSON(generatorData)
      }

      // Load upgrades
      for (const upgradeData of saveData.upgrades) {
        const upgrade = this.upgrades.get(upgradeData.id)
        if (upgrade) {
          upgrade.fromJSON(upgradeData)
          // Re-apply upgrade effects
          for (let i = 0; i < upgrade.purchased; i++) {
            upgrade.effect()
          }
        }
      }

      // Load achievements
      for (const achievementData of saveData.achievements) {
        const achievement = this.achievements.get(achievementData.id)
        achievement?.fromJSON(achievementData)
      }

      // Load statistics
      if (saveData.statistics) {
        this.statistics.fromJSON(saveData.statistics)
      }

      // Process offline progress
      if (saveData.timestamp) {
        const offlineTime = (Date.now() - saveData.timestamp) / 1000 // seconds
        this.processOfflineProgress(offlineTime)
      }

      return true
    } catch (error) {
      console.error('Failed to load save data:', error)
      return false
    }
  }

  private processOfflineProgress(seconds: number): void {
    // Cap offline progress to prevent abuse (e.g., max 24 hours)
    const maxOfflineTime = 24 * 60 * 60
    const offlineTime = Math.min(seconds, maxOfflineTime)

    // Process generators for offline time
    for (const generator of this.generators.values()) {
      const production = generator.getCurrentProduction() * offlineTime
      const resource = this.resources.get(generator.producesResourceId)
      if (resource && production > 0) {
        resource.add(production)
        this.statistics.recordResourceEarned(generator.producesResourceId, production)
      }
    }
  }

  reset(): void {
    for (const resource of this.resources.values()) {
      resource.fromJSON({ amount: 0 })
    }
    for (const generator of this.generators.values()) {
      generator.fromJSON({ purchased: 0 })
    }
    for (const upgrade of this.upgrades.values()) {
      upgrade.fromJSON({ purchased: 0 })
    }
    for (const achievement of this.achievements.values()) {
      achievement.fromJSON({ unlocked: false })
    }
    this.statistics.reset()
    localStorage.removeItem('idleGameSave')
  }
}
