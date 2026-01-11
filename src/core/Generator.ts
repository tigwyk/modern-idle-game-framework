import type { Resource } from './Resource'

export interface GeneratorCost {
  resourceId: string
  baseAmount: number
  scalingFactor?: number
}

export interface GeneratorConfig {
  id: string
  name: string
  description?: string
  producesResourceId: string
  baseProductionRate: number
  costs: GeneratorCost[]
  maxPurchases?: number
}

export class Generator {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly producesResourceId: string
  public readonly baseProductionRate: number
  public readonly costs: GeneratorCost[]
  public readonly maxPurchases: number | null
  public purchased: number

  constructor(config: GeneratorConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description || ''
    this.producesResourceId = config.producesResourceId
    this.baseProductionRate = config.baseProductionRate
    this.costs = config.costs.map(cost => ({
      ...cost,
      scalingFactor: cost.scalingFactor ?? 1.15
    }))
    this.maxPurchases = config.maxPurchases || null
    this.purchased = 0
  }

  getCurrentCosts(): Map<string, number> {
    const costs = new Map<string, number>()
    for (const cost of this.costs) {
      const amount = cost.baseAmount * Math.pow(cost.scalingFactor!, this.purchased)
      costs.set(cost.resourceId, amount)
    }
    return costs
  }

  canPurchase(resources: Map<string, Resource>): boolean {
    if (this.maxPurchases !== null && this.purchased >= this.maxPurchases) {
      return false
    }

    const costs = this.getCurrentCosts()
    for (const [resourceId, amount] of costs) {
      const resource = resources.get(resourceId)
      if (!resource || !resource.canAfford(amount)) {
        return false
      }
    }
    return true
  }

  purchase(resources: Map<string, Resource>): boolean {
    if (!this.canPurchase(resources)) {
      return false
    }

    const costs = this.getCurrentCosts()
    for (const [resourceId, amount] of costs) {
      const resource = resources.get(resourceId)
      resource?.subtract(amount)
    }

    this.purchased++
    return true
  }

  getCurrentProduction(): number {
    return this.baseProductionRate * this.purchased
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
