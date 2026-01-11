export interface ResourceConfig {
  id: string
  name: string
  description?: string
  initialAmount?: number
  maxAmount?: number
  displayPrecision?: number
}

export class Resource {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public amount: number
  public maxAmount: number | null
  public displayPrecision: number

  constructor(config: ResourceConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description || ''
    this.amount = config.initialAmount || 0
    this.maxAmount = config.maxAmount || null
    this.displayPrecision = config.displayPrecision ?? 2
  }

  add(value: number): void {
    this.amount += value
    if (this.maxAmount !== null && this.amount > this.maxAmount) {
      this.amount = this.maxAmount
    }
  }

  subtract(value: number): boolean {
    if (this.amount >= value) {
      this.amount -= value
      return true
    }
    return false
  }

  canAfford(value: number): boolean {
    return this.amount >= value
  }

  getDisplayAmount(): string {
    if (this.amount >= 1e6) {
      return this.formatScientific(this.amount)
    }
    return this.amount.toFixed(this.displayPrecision)
  }

  private formatScientific(value: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
    const tier = Math.floor(Math.log10(Math.abs(value)) / 3)

    if (tier <= 0) return value.toFixed(this.displayPrecision)
    if (tier >= suffixes.length) {
      return value.toExponential(this.displayPrecision)
    }

    const suffix = suffixes[tier]
    const scale = Math.pow(10, tier * 3)
    const scaled = value / scale

    return scaled.toFixed(this.displayPrecision) + suffix
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
    }
  }

  fromJSON(data: { amount: number }): void {
    this.amount = data.amount
  }
}
