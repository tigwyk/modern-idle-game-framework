export interface AchievementConfig {
  id: string
  name: string
  description: string
  condition: () => boolean
  reward?: () => void
  isSecret?: boolean
}

export class Achievement {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly condition: () => boolean
  public readonly reward?: () => void
  public readonly isSecret: boolean
  public unlocked: boolean

  constructor(config: AchievementConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.condition = config.condition
    this.reward = config.reward
    this.isSecret = config.isSecret ?? false
    this.unlocked = false
  }

  check(): boolean {
    if (this.unlocked) {
      return false
    }

    if (this.condition()) {
      this.unlocked = true
      this.reward?.()
      return true
    }

    return false
  }

  toJSON() {
    return {
      id: this.id,
      unlocked: this.unlocked,
    }
  }

  fromJSON(data: { unlocked: boolean }): void {
    this.unlocked = data.unlocked
  }
}
