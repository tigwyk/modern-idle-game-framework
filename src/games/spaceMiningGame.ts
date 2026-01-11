import { GameEngine, Resource, Generator, Upgrade, Achievement, Multiplier } from '../core'

/**
 * Space Mining Game - A demo idle game showcasing the framework
 *
 * This game demonstrates:
 * - Multiple interconnected resources
 * - Generators with different production mechanics
 * - Strategic upgrades with multipliers
 * - Progression through different tiers of technology
 * - Achievement system with secrets
 *
 * Theme: Mine asteroids to collect minerals, refine them into credits,
 * and build an interstellar mining empire!
 */
export function createSpaceMiningGame(): GameEngine {
  const engine = new GameEngine({
    tickRate: 100, // 100ms = 10 ticks per second
    autoSaveInterval: 30000, // Auto-save every 30 seconds
  })

  // ============================================================================
  // RESOURCES
  // ============================================================================

  const minerals = new Resource({
    id: 'minerals',
    name: 'Minerals',
    description: 'Raw materials extracted from asteroids',
    initialAmount: 0,
    displayPrecision: 0,
  })

  const credits = new Resource({
    id: 'credits',
    name: 'Credits',
    description: 'Galactic currency for trading',
    initialAmount: 0,
    displayPrecision: 0,
  })

  const energy = new Resource({
    id: 'energy',
    name: 'Energy',
    description: 'Power for your mining operations',
    initialAmount: 100,
    displayPrecision: 0,
  })

  engine.addResource(minerals)
  engine.addResource(credits)
  engine.addResource(energy)

  // ============================================================================
  // GENERATORS - Mining Equipment
  // ============================================================================

  const miningDrone = new Generator({
    id: 'mining_drone',
    name: 'Mining Drone',
    description: 'Basic autonomous mining unit',
    producesResourceId: 'minerals',
    baseProductionRate: 0.5,
    costs: [{ resourceId: 'credits', baseAmount: 10, scalingFactor: 1.15 }],
  })

  const asteroidMiner = new Generator({
    id: 'asteroid_miner',
    name: 'Asteroid Miner',
    description: 'Heavy-duty mining vessel',
    producesResourceId: 'minerals',
    baseProductionRate: 3,
    costs: [
      { resourceId: 'credits', baseAmount: 100, scalingFactor: 1.15 },
      { resourceId: 'minerals', baseAmount: 50, scalingFactor: 1.1 },
    ],
  })

  const miningStation = new Generator({
    id: 'mining_station',
    name: 'Mining Station',
    description: 'Orbital facility for large-scale operations',
    producesResourceId: 'minerals',
    baseProductionRate: 20,
    costs: [
      { resourceId: 'credits', baseAmount: 1000, scalingFactor: 1.15 },
      { resourceId: 'minerals', baseAmount: 500, scalingFactor: 1.1 },
    ],
  })

  // Energy Generators
  const solarPanel = new Generator({
    id: 'solar_panel',
    name: 'Solar Panel',
    description: 'Converts starlight into energy',
    producesResourceId: 'energy',
    baseProductionRate: 1,
    costs: [
      { resourceId: 'credits', baseAmount: 50, scalingFactor: 1.12 },
      { resourceId: 'minerals', baseAmount: 20, scalingFactor: 1.08 },
    ],
  })

  const fusionReactor = new Generator({
    id: 'fusion_reactor',
    name: 'Fusion Reactor',
    description: 'Advanced power generation',
    producesResourceId: 'energy',
    baseProductionRate: 10,
    costs: [
      { resourceId: 'credits', baseAmount: 500, scalingFactor: 1.15 },
      { resourceId: 'minerals', baseAmount: 300, scalingFactor: 1.1 },
    ],
  })

  // Credit Generators (Refineries)
  const basicRefinery = new Generator({
    id: 'basic_refinery',
    name: 'Basic Refinery',
    description: 'Processes minerals into credits',
    producesResourceId: 'credits',
    baseProductionRate: 1,
    costs: [{ resourceId: 'minerals', baseAmount: 100, scalingFactor: 1.15 }],
  })

  const advancedRefinery = new Generator({
    id: 'advanced_refinery',
    name: 'Advanced Refinery',
    description: 'High-efficiency mineral processing',
    producesResourceId: 'credits',
    baseProductionRate: 8,
    costs: [
      { resourceId: 'minerals', baseAmount: 1000, scalingFactor: 1.15 },
      { resourceId: 'credits', baseAmount: 500, scalingFactor: 1.12 },
    ],
  })

  engine.addGenerator(miningDrone)
  engine.addGenerator(asteroidMiner)
  engine.addGenerator(miningStation)
  engine.addGenerator(solarPanel)
  engine.addGenerator(fusionReactor)
  engine.addGenerator(basicRefinery)
  engine.addGenerator(advancedRefinery)

  // ============================================================================
  // MULTIPLIERS
  // ============================================================================

  const droneEfficiencyMultiplier = new Multiplier({
    id: 'drone_efficiency',
    name: 'Drone Efficiency Boost',
    description: 'Improved drone AI increases mining speed',
    type: 'multiplicative',
    value: 2,
    target: 'mining_drone',
  })

  const minerPowerMultiplier = new Multiplier({
    id: 'miner_power',
    name: 'Miner Power Boost',
    description: 'Enhanced drilling systems',
    type: 'multiplicative',
    value: 2,
    target: 'asteroid_miner',
  })

  const stationAutomationMultiplier = new Multiplier({
    id: 'station_automation',
    name: 'Station Automation',
    description: 'Automated systems increase efficiency',
    type: 'multiplicative',
    value: 3,
    target: 'mining_station',
  })

  const refinerySpeedMultiplier = new Multiplier({
    id: 'refinery_speed',
    name: 'Refinery Speed Boost',
    description: 'Faster processing technology',
    type: 'multiplicative',
    value: 2,
    target: 'basic_refinery',
  })

  const energyEfficiencyMultiplier = new Multiplier({
    id: 'energy_efficiency',
    name: 'Energy Efficiency',
    description: 'All operations use less energy',
    type: 'multiplicative',
    value: 1.5,
    target: 'solar_panel',
  })

  // ============================================================================
  // UPGRADES
  // ============================================================================

  // Early game upgrades
  const improvedDrillBits = new Upgrade({
    id: 'improved_drill_bits',
    name: 'Improved Drill Bits',
    description: 'Mining drones work twice as fast',
    costs: [{ resourceId: 'credits', amount: 50 }],
    effect: () => {
      miningDrone.addMultiplier(droneEfficiencyMultiplier)
    },
    isVisible: () => miningDrone.purchased >= 1,
  })

  const betterScanning = new Upgrade({
    id: 'better_scanning',
    name: 'Better Scanning',
    description: 'Find richer mineral deposits (+1 mineral per manual harvest)',
    costs: [{ resourceId: 'credits', amount: 100 }],
    effect: () => {
      // This would affect manual harvesting in the UI
    },
  })

  const heavyDutyDrills = new Upgrade({
    id: 'heavy_duty_drills',
    name: 'Heavy-Duty Drills',
    description: 'Asteroid miners work twice as fast',
    costs: [{ resourceId: 'credits', amount: 500 }],
    effect: () => {
      asteroidMiner.addMultiplier(minerPowerMultiplier)
    },
    isVisible: () => asteroidMiner.purchased >= 1,
  })

  // Mid game upgrades
  const automatedSystems = new Upgrade({
    id: 'automated_systems',
    name: 'Automated Systems',
    description: 'Mining stations triple their output',
    costs: [
      { resourceId: 'credits', amount: 5000 },
      { resourceId: 'energy', amount: 100 },
    ],
    effect: () => {
      miningStation.addMultiplier(stationAutomationMultiplier)
    },
    isVisible: () => miningStation.purchased >= 1,
  })

  const quantumProcessing = new Upgrade({
    id: 'quantum_processing',
    name: 'Quantum Processing',
    description: 'Refineries work twice as fast',
    costs: [
      { resourceId: 'credits', amount: 2000 },
      { resourceId: 'energy', amount: 50 },
    ],
    effect: () => {
      basicRefinery.addMultiplier(refinerySpeedMultiplier)
    },
    isVisible: () => basicRefinery.purchased >= 1,
  })

  const solarOptimization = new Upgrade({
    id: 'solar_optimization',
    name: 'Solar Optimization',
    description: 'Solar panels 50% more efficient',
    costs: [
      { resourceId: 'credits', amount: 300 },
      { resourceId: 'minerals', amount: 150 },
    ],
    effect: () => {
      solarPanel.addMultiplier(energyEfficiencyMultiplier)
    },
    isVisible: () => solarPanel.purchased >= 1,
  })

  // Late game upgrades
  const megaDrills = new Upgrade({
    id: 'mega_drills',
    name: 'Mega Drills',
    description: 'All mining equipment works 25% faster',
    costs: [
      { resourceId: 'credits', amount: 50000 },
      { resourceId: 'energy', amount: 500 },
    ],
    effect: () => {
      const globalMiningMultiplier = new Multiplier({
        id: 'global_mining_boost',
        name: 'Global Mining Boost',
        description: 'Mega drills enhance all mining',
        type: 'multiplicative',
        value: 1.25,
        // No target specified - applies manually to each generator
      })
      miningDrone.addMultiplier(globalMiningMultiplier)
      asteroidMiner.addMultiplier(globalMiningMultiplier)
      miningStation.addMultiplier(globalMiningMultiplier)
    },
    isVisible: () => {
      const totalMiners = miningDrone.purchased + asteroidMiner.purchased + miningStation.purchased
      return totalMiners >= 50
    },
  })

  engine.addUpgrade(improvedDrillBits)
  engine.addUpgrade(betterScanning)
  engine.addUpgrade(heavyDutyDrills)
  engine.addUpgrade(automatedSystems)
  engine.addUpgrade(quantumProcessing)
  engine.addUpgrade(solarOptimization)
  engine.addUpgrade(megaDrills)

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================

  const firstMinerals = new Achievement({
    id: 'first_minerals',
    name: 'First Strike',
    description: 'Collect your first minerals',
    condition: () => minerals.amount >= 1,
  })

  const hundredMinerals = new Achievement({
    id: 'hundred_minerals',
    name: 'Mineral Collector',
    description: 'Collect 100 minerals',
    condition: () => minerals.amount >= 100,
  })

  const firstDrone = new Achievement({
    id: 'first_drone',
    name: 'Automation Begins',
    description: 'Purchase your first mining drone',
    condition: () => miningDrone.purchased >= 1,
  })

  const firstRefinery = new Achievement({
    id: 'first_refinery',
    name: 'Industrial Revolution',
    description: 'Build your first refinery',
    condition: () => basicRefinery.purchased >= 1,
  })

  const tenGenerators = new Achievement({
    id: 'ten_generators',
    name: 'Mining Fleet',
    description: 'Own 10 generators total',
    condition: () => {
      const total =
        miningDrone.purchased +
        asteroidMiner.purchased +
        miningStation.purchased +
        solarPanel.purchased +
        fusionReactor.purchased +
        basicRefinery.purchased +
        advancedRefinery.purchased
      return total >= 10
    },
  })

  const thousandCredits = new Achievement({
    id: 'thousand_credits',
    name: 'Galactic Entrepreneur',
    description: 'Accumulate 1,000 credits',
    condition: () => credits.amount >= 1000,
  })

  const fiveUpgrades = new Achievement({
    id: 'five_upgrades',
    name: 'Tech Enthusiast',
    description: 'Purchase 5 different upgrades',
    condition: () => engine.getAllUpgrades().filter(u => u.purchased > 0).length >= 5,
  })

  const hundredEnergy = new Achievement({
    id: 'hundred_energy',
    name: 'Power Grid',
    description: 'Have 100 energy stored',
    condition: () => energy.amount >= 100,
  })

  // Secret achievements
  const secretRich = new Achievement({
    id: 'secret_rich',
    name: 'Space Tycoon',
    description: 'Accumulate 100,000 credits',
    condition: () => credits.amount >= 100000,
    isSecret: true,
  })

  const secretMassProduction = new Achievement({
    id: 'secret_mass_production',
    name: 'Industrial Complex',
    description: 'Own 50 generators of any type',
    condition: () => {
      const total =
        miningDrone.purchased +
        asteroidMiner.purchased +
        miningStation.purchased +
        solarPanel.purchased +
        fusionReactor.purchased +
        basicRefinery.purchased +
        advancedRefinery.purchased
      return total >= 50
    },
    isSecret: true,
  })

  const secretAllUpgrades = new Achievement({
    id: 'secret_all_upgrades',
    name: 'Technological Singularity',
    description: 'Purchase all available upgrades',
    condition: () => {
      const upgrades = engine.getAllUpgrades()
      return upgrades.every(u => u.purchased > 0)
    },
    isSecret: true,
  })

  engine.addAchievement(firstMinerals)
  engine.addAchievement(hundredMinerals)
  engine.addAchievement(firstDrone)
  engine.addAchievement(firstRefinery)
  engine.addAchievement(tenGenerators)
  engine.addAchievement(thousandCredits)
  engine.addAchievement(fiveUpgrades)
  engine.addAchievement(hundredEnergy)
  engine.addAchievement(secretRich)
  engine.addAchievement(secretMassProduction)
  engine.addAchievement(secretAllUpgrades)

  return engine
}
