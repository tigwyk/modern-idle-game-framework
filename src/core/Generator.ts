import type { Resource } from './Resource'
import type { Multiplier } from './Multiplier'

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
  private productionMultipliers: Multiplier[] = []

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

  addMultiplier(multiplier: Multiplier): void {
    this.productionMultipliers.push(multiplier)
  }

  removeMultiplier(multiplierId: string): void {
    this.productionMultipliers = this.productionMultipliers.filter(m => m.id !== multiplierId)
  }

  getMultipliers(): Multiplier[] {
    return this.productionMultipliers
  }

  getCurrentCosts(): Map<string, number> {
    const costs = new Map<string, number>()
    for (const cost of this.costs) {
      const amount = cost.baseAmount * Math.pow(cost.scalingFactor!, this.purchased)
      costs.set(cost.resourceId, amount)
    }
    return costs
  }

  canPurchase(resources: Map<string, Resource>, quantity: number = 1): boolean {
    if (this.maxPurchases !== null && this.purchased + quantity > this.maxPurchases) {
      return false
    }

    // Calculate total cost for bulk purchase
    let totalCost = new Map<string, number>()
    
    for (let i = 0; i < quantity; i++) {
      const costs = this.getCurrentCostsForPurchase(this.purchased + i)
      for (const [resourceId, amount] of costs) {
        totalCost.set(resourceId, (totalCost.get(resourceId) || 0) + amount)
      }
    }

    // Check if can afford total cost
    for (const [resourceId, amount] of totalCost) {
      const resource = resources.get(resourceId)
      if (!resource || !resource.canAfford(amount)) {
        return false
      }
    }
    return true
  }

  private getCurrentCostsForPurchase(purchaseCount: number): Map<string, number> {
    const costs = new Map<string, number>()
    for (const cost of this.costs) {
      const amount = cost.baseAmount * Math.pow(cost.scalingFactor!, purchaseCount)
      costs.set(cost.resourceId, amount)
    }
    return costs
  }

  purchase(resources: Map<string, Resource>, quantity: number = 1): boolean {
    if (!this.canPurchase(resources, quantity)) {
      return false
    }

    // Calculate and deduct total cost
    let totalCost = new Map<string, number>()
    
    for (let i = 0; i < quantity; i++) {
      const costs = this.getCurrentCostsForPurchase(this.purchased + i)
      for (const [resourceId, amount] of costs) {
        totalCost.set(resourceId, (totalCost.get(resourceId) || 0) + amount)
      }
    }

    for (const [resourceId, amount] of totalCost) {
      const resource = resources.get(resourceId)
      resource?.subtract(amount)
    }

    this.purchased += quantity
    return true
  }

  getMaxAffordable(resources: Map<string, Resource>): number {
    const maxCheck = this.maxPurchases !== null 
      ? this.maxPurchases - this.purchased 
      : 1000

    // Binary search for maximum affordable quantity
    let left = 0
    let right = maxCheck
    let result = 0
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (this.canPurchase(resources, mid)) {
        result = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    
    return result
  }

  getCurrentProduction(): number {
    let production = this.baseProductionRate * this.purchased
    
    // Apply all active multipliers
    for (const multiplier of this.productionMultipliers) {
      if (multiplier.active) {
        production = multiplier.apply(production)
      }
    }
    
    return production
  }

  toJSON() {
    return {
      id: this.id,
      purchased: this.purchased,
      multipliers: this.productionMultipliers.map(m => m.toJSON())
    }
  }

  fromJSON(data: { purchased: number; multipliers?: any[] }): void {
    this.purchased = data.purchased
    // Note: Multipliers are re-applied by upgrade effects during load
    // so we don't restore them directly here
  }
}
