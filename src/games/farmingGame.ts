import { GameEngine, Resource, Generator, Upgrade, Achievement, Multiplier } from '../core'

/**
 * Simple Farming Game - A minimal example for learning the framework
 *
 * This is a beginner-friendly example showing the basics:
 * - 2 resources (Wheat and Gold)
 * - 2 generators (Farmer and Windmill)
 * - 1 upgrade with a multiplier
 * - 3 achievements
 *
 * Use this as a starting point for your own game!
 */
export function createFarmingGame(): GameEngine {
  // Step 1: Create the game engine
  const engine = new GameEngine({
    tickRate: 100, // Update 10 times per second
    autoSaveInterval: 30000, // Save every 30 seconds
  })

  // Step 2: Define resources
  const wheat = new Resource({
    id: 'wheat',
    name: 'Wheat',
    description: 'Golden grain from your fields',
    initialAmount: 0,
    displayPrecision: 0, // Show as whole numbers
  })

  const gold = new Resource({
    id: 'gold',
    name: 'Gold Coins',
    description: 'Currency for purchasing upgrades',
    initialAmount: 10, // Start with 10 gold
    displayPrecision: 0,
  })

  engine.addResource(wheat)
  engine.addResource(gold)

  // Step 3: Create generators
  const farmer = new Generator({
    id: 'farmer',
    name: 'Farmer',
    description: 'A hardworking farmer who grows wheat',
    producesResourceId: 'wheat',
    baseProductionRate: 1, // Produces 1 wheat per second
    costs: [
      {
        resourceId: 'gold',
        baseAmount: 10, // First farmer costs 10 gold
        scalingFactor: 1.15, // Each farmer costs 15% more than the last
      },
    ],
  })

  const windmill = new Generator({
    id: 'windmill',
    name: 'Windmill',
    description: 'Processes wheat into gold',
    producesResourceId: 'gold',
    baseProductionRate: 0.5, // Produces 0.5 gold per second
    costs: [
      {
        resourceId: 'wheat',
        baseAmount: 50,
        scalingFactor: 1.2, // Gets expensive faster
      },
    ],
  })

  engine.addGenerator(farmer)
  engine.addGenerator(windmill)

  // Step 4: Create a multiplier for an upgrade
  const betterTools = new Multiplier({
    id: 'better_tools',
    name: 'Better Tools',
    description: 'Farmers work faster with better tools',
    type: 'multiplicative',
    value: 2, // Doubles production
    target: 'farmer', // Only affects farmers
  })

  // Step 5: Create upgrades
  const toolUpgrade = new Upgrade({
    id: 'tool_upgrade',
    name: 'Better Tools',
    description: 'Farmers work twice as fast',
    costs: [{ resourceId: 'gold', amount: 50 }],
    effect: () => {
      // Apply the multiplier to farmers
      farmer.addMultiplier(betterTools)
    },
    isVisible: () => farmer.purchased >= 1, // Only show if you have a farmer
  })

  const moreLand = new Upgrade({
    id: 'more_land',
    name: 'More Farmland',
    description: 'Unlock more space for farming',
    costs: [{ resourceId: 'gold', amount: 100 }],
    effect: () => {
      // This upgrade doesn't do much in this simple example
      // In a real game, you might unlock new features
    },
  })

  engine.addUpgrade(toolUpgrade)
  engine.addUpgrade(moreLand)

  // Step 6: Create achievements
  const firstWheat = new Achievement({
    id: 'first_wheat',
    name: 'First Harvest',
    description: 'Collect your first wheat',
    condition: () => wheat.amount >= 1,
  })

  const firstFarmer = new Achievement({
    id: 'first_farmer',
    name: 'Growing Team',
    description: 'Hire your first farmer',
    condition: () => farmer.purchased >= 1,
  })

  const hundredWheat = new Achievement({
    id: 'hundred_wheat',
    name: 'Bountiful Harvest',
    description: 'Accumulate 100 wheat',
    condition: () => wheat.amount >= 100,
  })

  const secretRich = new Achievement({
    id: 'secret_rich',
    name: 'Golden Touch',
    description: 'Accumulate 500 gold',
    condition: () => gold.amount >= 500,
    isSecret: true, // Hidden until unlocked
  })

  engine.addAchievement(firstWheat)
  engine.addAchievement(firstFarmer)
  engine.addAchievement(hundredWheat)
  engine.addAchievement(secretRich)

  // Step 7: Return the configured engine
  return engine
}
