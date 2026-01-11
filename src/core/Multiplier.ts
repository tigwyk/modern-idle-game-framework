export interface MultiplierConfig {
  id: string
  name: string
  description?: string
  type: 'additive' | 'multiplicative'
  value: number
  target?: string // Optional: target specific generator/resource
}

export class Multiplier {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly type: 'additive' | 'multiplicative'
  private _value: number
  public readonly target?: string
  public active: boolean

  constructor(config: MultiplierConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description || ''
    this.type = config.type
    this._value = config.value
    this.target = config.target
    this.active = true
  }

  get value(): number {
    return this._value
  }

  setValue(newValue: number): void {
    this._value = newValue
  }

  apply(baseValue: number): number {
    if (!this.active) {
      return baseValue
    }

    if (this.type === 'additive') {
      return baseValue + this.value
    } else {
      return baseValue * this.value
    }
  }

  toJSON() {
    return {
      id: this.id,
      value: this.value,
      active: this.active,
    }
  }

  fromJSON(data: { value?: number; active?: boolean }): void {
    if (data.value !== undefined) {
      this._value = data.value
    }
    if (data.active !== undefined) {
      this.active = data.active
    }
  }
}
