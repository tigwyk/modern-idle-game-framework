import type { Resource } from './Resource'

export interface UpgradeCost {
  resourceId: string
  amount: number
}

export interface UpgradeConfig {
  id: string
  name: string
  description: string
  costs: UpgradeCost[]
  effect: () => void
  isVisible?: () => boolean
  maxPurchases?: number
}

export class Upgrade {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly costs: UpgradeCost[]
  public readonly effect: () => void
  public readonly isVisible: () => boolean
  public readonly maxPurchases: number
  public purchased: number

  constructor(config: UpgradeConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.costs = config.costs
    this.effect = config.effect
    this.isVisible = config.isVisible || (() => true)
    this.maxPurchases = config.maxPurchases ?? 1
    this.purchased = 0
  }

  canPurchase(resources: Map<string, Resource>): boolean {
    if (this.purchased >= this.maxPurchases) {
      return false
    }

    for (const cost of this.costs) {
      const resource = resources.get(cost.resourceId)
      if (!resource || !resource.canAfford(cost.amount)) {
        return false
      }
    }
    return true
  }

  purchase(resources: Map<string, Resource>): { success: boolean; costs: UpgradeCost[] } {
    if (!this.canPurchase(resources)) {
      return { success: false, costs: [] }
    }

    for (const cost of this.costs) {
      const resource = resources.get(cost.resourceId)
      resource?.subtract(cost.amount)
    }

    this.purchased++
    this.effect()
    return { success: true, costs: this.costs }
  }

  isMaxed(): boolean {
    return this.purchased >= this.maxPurchases
  }

  toJSON() {
    return {
      id: this.id,
      purchased: this.purchased
    }
  }

  fromJSON(data: { purchased: number }): void {
    this.purchased = data.purchased
  }
}
