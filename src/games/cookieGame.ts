import { GameEngine, Resource, Generator, Upgrade, Achievement } from '../core'

export function createCookieGame(): GameEngine {
  const engine = new GameEngine({
    tickRate: 100,
    autoSaveInterval: 30000
  })

  // Create resources
  const cookies = new Resource({
    id: 'cookies',
    name: 'Cookies',
    description: 'Delicious cookies',
    initialAmount: 0,
    displayPrecision: 0
  })

  engine.addResource(cookies)

  // Create generators
  const cursor = new Generator({
    id: 'cursor',
    name: 'Cursor',
    description: 'Clicks cookies automatically',
    producesResourceId: 'cookies',
    baseProductionRate: 0.1,
    costs: [{ resourceId: 'cookies', baseAmount: 15, scalingFactor: 1.15 }]
  })

  const grandma = new Generator({
    id: 'grandma',
    name: 'Grandma',
    description: 'A nice grandma who bakes cookies',
    producesResourceId: 'cookies',
    baseProductionRate: 1,
    costs: [{ resourceId: 'cookies', baseAmount: 100, scalingFactor: 1.15 }]
  })

  const farm = new Generator({
    id: 'farm',
    name: 'Cookie Farm',
    description: 'Grows cookie ingredients',
    producesResourceId: 'cookies',
    baseProductionRate: 8,
    costs: [{ resourceId: 'cookies', baseAmount: 1100, scalingFactor: 1.15 }]
  })

  const factory = new Generator({
    id: 'factory',
    name: 'Cookie Factory',
    description: 'Mass produces cookies',
    producesResourceId: 'cookies',
    baseProductionRate: 47,
    costs: [{ resourceId: 'cookies', baseAmount: 12000, scalingFactor: 1.15 }]
  })

  engine.addGenerator(cursor)
  engine.addGenerator(grandma)
  engine.addGenerator(farm)
  engine.addGenerator(factory)

  // Create upgrades
  const cursorUpgrade1 = new Upgrade({
    id: 'cursor_upgrade_1',
    name: 'Better Cursors',
    description: 'Cursors are twice as efficient',
    costs: [{ resourceId: 'cookies', amount: 100 }],
    effect: () => {
      cursor.costs[0].scalingFactor! *= 0.95
    },
    isVisible: () => cursor.purchased >= 1
  })

  const grandmaUpgrade1 = new Upgrade({
    id: 'grandma_upgrade_1',
    name: 'Bingo Center',
    description: 'Grandmas are twice as efficient',
    costs: [{ resourceId: 'cookies', amount: 1000 }],
    effect: () => {
      // This would double grandma production in a real implementation
      // For now, it's just a cost reduction
      grandma.costs[0].scalingFactor! *= 0.95
    },
    isVisible: () => grandma.purchased >= 1
  })

  const clickPower = new Upgrade({
    id: 'click_power',
    name: 'Reinforced Fingers',
    description: 'Clicking gives +1 cookie per click',
    costs: [{ resourceId: 'cookies', amount: 50 }],
    effect: () => {
      // In a real game, this would affect manual clicks
      // Here it's just demonstrative
    }
  })

  engine.addUpgrade(cursorUpgrade1)
  engine.addUpgrade(grandmaUpgrade1)
  engine.addUpgrade(clickPower)

  // Create achievements
  const firstCookie = new Achievement({
    id: 'first_cookie',
    name: 'First Cookie',
    description: 'Bake your first cookie',
    condition: () => cookies.amount >= 1
  })

  const hundredCookies = new Achievement({
    id: 'hundred_cookies',
    name: 'Cookie Hundred',
    description: 'Bake 100 cookies',
    condition: () => cookies.amount >= 100
  })

  const firstGenerator = new Achievement({
    id: 'first_generator',
    name: 'Getting Help',
    description: 'Purchase your first generator',
    condition: () => cursor.purchased >= 1 || grandma.purchased >= 1
  })

  const tenGenerators = new Achievement({
    id: 'ten_generators',
    name: 'Production Line',
    description: 'Own 10 generators total',
    condition: () => {
      const total = cursor.purchased + grandma.purchased + farm.purchased + factory.purchased
      return total >= 10
    }
  })

  const secretAchievement = new Achievement({
    id: 'secret',
    name: 'Secret Baker',
    description: 'Reach 10,000 cookies',
    condition: () => cookies.amount >= 10000,
    isSecret: true
  })

  engine.addAchievement(firstCookie)
  engine.addAchievement(hundredCookies)
  engine.addAchievement(firstGenerator)
  engine.addAchievement(tenGenerators)
  engine.addAchievement(secretAchievement)

  return engine
}
