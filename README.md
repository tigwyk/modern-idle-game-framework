# Idle Game Framework

A modern, extensible framework for building idle/incremental games using Vue 3, TypeScript, and Vite.

## Features

- **Core Game Systems**
  - Resource management with automatic formatting (K, M, B, T, etc.)
  - Generators with configurable costs and scaling
  - Upgrades with visibility conditions and effects
  - Achievement system with secret achievements support
  - Auto-save functionality
  - Offline progress calculation

- **Modern Tech Stack**
  - Vue 3 with Composition API
  - TypeScript for type safety
  - Pinia for state management
  - Vite for fast development

- **Ready-to-Use Components**
  - ResourceDisplay
  - GeneratorCard
  - UpgradeCard
  - AchievementCard

## Getting Started

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

## Usage

### Creating a Game

Create a new game by instantiating the `GameEngine` and adding resources, generators, upgrades, and achievements:

```typescript
import { GameEngine, Resource, Generator, Upgrade, Achievement } from './core'

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

  // Add an upgrade
  const upgrade = new Upgrade({
    id: 'better_pickaxe',
    name: 'Better Pickaxe',
    description: 'Miners work twice as fast',
    costs: [{ resourceId: 'gold', amount: 100 }],
    effect: () => {
      // Apply upgrade effect
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
      @purchase="gameStore.purchaseGenerator"
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

### Upgrade
One-time or repeatable purchases that enhance gameplay.
- Custom effects
- Visibility conditions
- Multi-purchase support

### Achievement
Tracks player milestones.
- Automatic condition checking
- Optional rewards
- Secret achievements

### GameEngine
Orchestrates all game systems.
- Manages game loop
- Handles save/load
- Calculates offline progress
- Auto-save support

## Example Game

The project includes a Cookie Clicker-style demo game showcasing all framework features. Check `src/games/cookieGame.ts` for implementation details.

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
