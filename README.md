# Idle Game Framework

A modern, extensible framework for building idle/incremental games using Vue 3, TypeScript, and Vite.

## Features

- **Core Game Systems**
  - Resource management with automatic formatting (K, M, B, T, etc.)
  - Generators with configurable costs and scaling
  - **Bulk purchase support** (Buy 1, 10, 100, or max)
  - Upgrades with visibility conditions and effects
  - **Multiplier system** for flexible production/cost modifications
  - Achievement system with secret achievements support
  - **Statistics tracking** (total clicks, time played, resources earned, etc.)
  - Auto-save functionality
  - Offline progress calculation

- **Modern Tech Stack**
  - Vue 3 with Composition API
  - TypeScript for type safety
  - Pinia for state management
  - Vite for fast development
  - ESLint + Prettier for code quality

- **Accessibility Features**
  - ARIA labels on all interactive elements
  - Keyboard navigation support
  - Screen reader announcements
  - High contrast mode support
  - Reduced motion support
  - Focus management

- **Ready-to-Use Components**
  - ResourceDisplay
  - GeneratorCard (with bulk purchase buttons)
  - UpgradeCard
  - AchievementCard
  - StatisticsPanel

## Getting Started

### Quick Start for New Developers

**New to the framework?** Check out our comprehensive [Getting Started Guide](./GETTING_STARTED.md) that walks you through creating your first idle game step-by-step!

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run format
```

## Usage

### Creating a Game

Create a new game by instantiating the `GameEngine` and adding resources, generators, upgrades, and achievements:

```typescript
import { GameEngine, Resource, Generator, Upgrade, Achievement, Multiplier } from './core'

function createMyGame(): GameEngine {
  const engine = new GameEngine({
    tickRate: 100,        // 100ms = 10 ticks per second
    autoSaveInterval: 30000  // Auto-save every 30 seconds
  })

  // Add a resource
  const gold = new Resource({
    id: 'gold',
    name: 'Gold',
    description: 'Shiny currency',
    initialAmount: 0,
    displayPrecision: 0
  })
  engine.addResource(gold)

  // Add a generator
  const miner = new Generator({
    id: 'miner',
    name: 'Miner',
    description: 'Mines gold automatically',
    producesResourceId: 'gold',
    baseProductionRate: 1,
    costs: [{ resourceId: 'gold', baseAmount: 10, scalingFactor: 1.15 }]
  })
  engine.addGenerator(miner)

  // Add a multiplier
  const minerMultiplier = new Multiplier({
    id: 'miner_boost',
    name: 'Miner Production Boost',
    description: 'Doubles miner production',
    type: 'multiplicative',
    value: 2,
    target: 'miner'
  })

  // Add an upgrade that applies the multiplier
  const upgrade = new Upgrade({
    id: 'better_pickaxe',
    name: 'Better Pickaxe',
    description: 'Miners work twice as fast',
    costs: [{ resourceId: 'gold', amount: 100 }],
    effect: () => {
      miner.addMultiplier(minerMultiplier)
    }
  })
  engine.addUpgrade(upgrade)

  // Add an achievement
  const achievement = new Achievement({
    id: 'first_gold',
    name: 'First Gold',
    description: 'Collect your first gold',
    condition: () => gold.amount >= 1
  })
  engine.addAchievement(achievement)

  return engine
}
```

### Integrating with Vue

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from './stores/game'
import { createMyGame } from './games/myGame'

const gameStore = useGameStore()

onMounted(() => {
  const engine = createMyGame()
  gameStore.initializeGame(engine)
  gameStore.loadGame()
  gameStore.startGame()
})
</script>

<template>
  <div>
    <ResourceDisplay
      v-for="resource in gameStore.resources"
      :key="resource.id"
      :resource="resource"
    />
    <GeneratorCard
      v-for="generator in gameStore.generators"
      :key="generator.id"
      :generator="generator"
      :resources="gameStore.resources"
      @purchase="(id, qty) => gameStore.purchaseGenerator(id, qty)"
    />
  </div>
</template>
```

## Core Classes

### Resource
Represents a game resource (e.g., gold, cookies, energy).
- Automatic number formatting for large values
- Optional maximum amounts
- Configurable display precision

### Generator
Produces resources over time.
- Configurable production rates
- Multiple cost requirements
- Exponential cost scaling
- Optional purchase limits
- **Bulk purchase support** (buy 1, 10, 100, or max)
- **Multiplier support** for flexible production modifications

### Multiplier
Modifies production rates or other values.
- Additive or multiplicative types
- Can target specific generators
- Stackable for complex effects

### Upgrade
One-time or repeatable purchases that enhance gameplay.
- Custom effects
- Visibility conditions
- Multi-purchase support
- Can apply multipliers to generators

### Achievement
Tracks player milestones.
- Automatic condition checking
- Optional rewards
- Secret achievements

### Statistics
Tracks player progress and statistics.
- Total resources earned/spent
- Total generators/upgrades purchased
- Achievements unlocked
- Time played
- Total manual clicks

### GameEngine
Orchestrates all game systems.
- Manages game loop
- Handles save/load
- Calculates offline progress
- Auto-save support
- Integrated statistics tracking

## Example Games

The framework includes two complete demo games to help you learn:

### 1. Space Mining Empire (Default Demo)
A comprehensive example featuring:
- Multiple interconnected resources (minerals, credits, energy)
- Strategic resource management and conversion chains
- Progressive unlocking of technology tiers
- 11 achievements including secret ones
- 7 different types of generators
- Both early and late-game upgrade paths

**File**: `src/games/spaceMiningGame.ts`

### 2. Cookie Clicker
A classic incremental game implementation showing:
- Simple single-resource gameplay
- Progressive generator purchases
- Multiplicative upgrade system
- Achievement milestones

**File**: `src/games/cookieGame.ts`

Both games showcase different approaches to game design using the same framework. Use them as references when building your own game!

To switch between games, edit `src/App.vue` and change the import/initialization.

## Project Structure

```
src/
├── core/               # Core framework classes
│   ├── Resource.ts
│   ├── Generator.ts
│   ├── Upgrade.ts
│   ├── Achievement.ts
│   └── GameEngine.ts
├── stores/            # Pinia stores
│   └── game.ts
├── components/        # Vue components
│   ├── ResourceDisplay.vue
│   ├── GeneratorCard.vue
│   ├── UpgradeCard.vue
│   └── AchievementCard.vue
├── games/            # Game implementations
│   └── cookieGame.ts
└── App.vue           # Main app component
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
