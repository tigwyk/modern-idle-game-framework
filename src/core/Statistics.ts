export interface SerializedStatistics {
  totalResourcesEarned: Array<[string, number]>
  totalResourcesSpent: Array<[string, number]>
  totalGeneratorsPurchased: Array<[string, number]>
  totalUpgradesPurchased: Array<[string, number]>
  achievementsUnlocked: number
  totalClicks: number
  timePlayed: number
  sessionStartTime: number
}

export interface Statistics {
  totalResourcesEarned: Map<string, number>
  totalResourcesSpent: Map<string, number>
  totalGeneratorsPurchased: Map<string, number>
  totalUpgradesPurchased: Map<string, number>
  achievementsUnlocked: number
  timePlayed: number
  totalClicks: number
  sessionStartTime: number
}

export class StatisticsTracker {
  private stats: Statistics

  constructor() {
    this.stats = {
      totalResourcesEarned: new Map(),
      totalResourcesSpent: new Map(),
      totalGeneratorsPurchased: new Map(),
      totalUpgradesPurchased: new Map(),
      achievementsUnlocked: 0,
      totalClicks: 0,
      timePlayed: 0,
      sessionStartTime: Date.now(),
    }
  }

  recordResourceEarned(resourceId: string, amount: number): void {
    const current = this.stats.totalResourcesEarned.get(resourceId) || 0
    this.stats.totalResourcesEarned.set(resourceId, current + amount)
  }

  recordResourceSpent(resourceId: string, amount: number): void {
    const current = this.stats.totalResourcesSpent.get(resourceId) || 0
    this.stats.totalResourcesSpent.set(resourceId, current + amount)
  }

  recordGeneratorPurchase(generatorId: string, quantity: number = 1): void {
    const current = this.stats.totalGeneratorsPurchased.get(generatorId) || 0
    this.stats.totalGeneratorsPurchased.set(generatorId, current + quantity)
  }

  recordUpgradePurchase(upgradeId: string): void {
    const current = this.stats.totalUpgradesPurchased.get(upgradeId) || 0
    this.stats.totalUpgradesPurchased.set(upgradeId, current + 1)
  }

  recordAchievementUnlocked(): void {
    this.stats.achievementsUnlocked++
  }

  recordClick(): void {
    this.stats.totalClicks++
  }

  updateTimePlayed(): void {
    const now = Date.now()
    const sessionTime = (now - this.stats.sessionStartTime) / 1000
    this.stats.timePlayed += sessionTime
    // Reset session start time to prevent duplicate counting
    this.stats.sessionStartTime = now
  }

  getStats(): Readonly<Statistics> {
    return this.stats
  }

  getTotalResourceEarned(resourceId: string): number {
    return this.stats.totalResourcesEarned.get(resourceId) || 0
  }

  getTotalResourceSpent(resourceId: string): number {
    return this.stats.totalResourcesSpent.get(resourceId) || 0
  }

  getTotalGeneratorsPurchased(generatorId?: string): number {
    if (generatorId) {
      return this.stats.totalGeneratorsPurchased.get(generatorId) || 0
    }
    return Array.from(this.stats.totalGeneratorsPurchased.values()).reduce(
      (sum, val) => sum + val,
      0
    )
  }

  getTotalUpgradesPurchased(): number {
    return Array.from(this.stats.totalUpgradesPurchased.values()).reduce(
      (sum, val) => sum + val,
      0
    )
  }

  getTimePlayed(): number {
    return this.stats.timePlayed
  }

  toJSON() {
    return {
      totalResourcesEarned: Array.from(this.stats.totalResourcesEarned.entries()),
      totalResourcesSpent: Array.from(this.stats.totalResourcesSpent.entries()),
      totalGeneratorsPurchased: Array.from(this.stats.totalGeneratorsPurchased.entries()),
      totalUpgradesPurchased: Array.from(this.stats.totalUpgradesPurchased.entries()),
      achievementsUnlocked: this.stats.achievementsUnlocked,
      totalClicks: this.stats.totalClicks,
      timePlayed: this.stats.timePlayed,
      sessionStartTime: this.stats.sessionStartTime,
    }
  }

  fromJSON(data: SerializedStatistics): void {
    if (data.totalResourcesEarned) {
      this.stats.totalResourcesEarned = new Map(data.totalResourcesEarned)
    }
    if (data.totalResourcesSpent) {
      this.stats.totalResourcesSpent = new Map(data.totalResourcesSpent)
    }
    if (data.totalGeneratorsPurchased) {
      this.stats.totalGeneratorsPurchased = new Map(data.totalGeneratorsPurchased)
    }
    if (data.totalUpgradesPurchased) {
      this.stats.totalUpgradesPurchased = new Map(data.totalUpgradesPurchased)
    }
    if (data.achievementsUnlocked !== undefined) {
      this.stats.achievementsUnlocked = data.achievementsUnlocked
    }
    if (data.totalClicks !== undefined) {
      this.stats.totalClicks = data.totalClicks
    }
    if (data.timePlayed !== undefined) {
      this.stats.timePlayed = data.timePlayed
    }
    if (data.sessionStartTime !== undefined) {
      this.stats.sessionStartTime = data.sessionStartTime
    }
  }

  reset(): void {
    this.stats = {
      totalResourcesEarned: new Map(),
      totalResourcesSpent: new Map(),
      totalGeneratorsPurchased: new Map(),
      totalUpgradesPurchased: new Map(),
      achievementsUnlocked: 0,
      totalClicks: 0,
      timePlayed: 0,
      sessionStartTime: Date.now(),
    }
  }
}
