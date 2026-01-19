# Getting Started with the Modern Idle Game Framework

Welcome! This guide will walk you through creating your first idle game using this framework. We'll use the **Space Mining Empire** demo as our reference example.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Understanding the Framework](#understanding-the-framework)
4. [Creating Your First Game](#creating-your-first-game)
5. [Testing Your Game](#testing-your-game)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) installed
- Basic knowledge of **TypeScript** and **Vue 3**
- A code editor (VS Code recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tigwyk/modern-idle-game-framework.git
cd modern-idle-game-framework
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually http://localhost:5173)

You should see the **Space Mining Empire** demo running!

## Understanding the Framework

### Core Concepts

The framework is built around several key classes:

#### 1. **GameEngine**
The main orchestrator that manages the game loop, save/load functionality, and coordinates all game systems.

```typescript
const engine = new GameEngine({
  tickRate: 100,        // Update every 100ms (10 times per second)
  autoSaveInterval: 30000  // Auto-save every 30 seconds
})
```

#### 2. **Resources**
Things players collect and spend (minerals, gold, energy, etc.)

```typescript
const minerals = new Resource({
  id: 'minerals',              // Unique identifier
  name: 'Minerals',            // Display name
  description: 'Raw materials extracted from asteroids',
  initialAmount: 0,            // Starting amount
  displayPrecision: 0          // Decimal places (0 = whole numbers)
})
```

#### 3. **Generators**
Automated producers that generate resources over time

```typescript
const miningDrone = new Generator({
  id: 'mining_drone',
  name: 'Mining Drone',
  description: 'Basic autonomous mining unit',
  producesResourceId: 'minerals',  // What it produces
  baseProductionRate: 0.5,         // Amount per second
  costs: [{ 
    resourceId: 'credits', 
    baseAmount: 10,           // Initial cost
    scalingFactor: 1.15       // Cost increases 15% each purchase
  }]
})
```

#### 4. **Multipliers**
Modifiers that change production rates or other values

```typescript
const droneBoost = new Multiplier({
  id: 'drone_efficiency',
  name: 'Drone Efficiency Boost',
  description: 'Improved drone AI',
  type: 'multiplicative',  // Can be 'additive' or 'multiplicative'
  value: 2,                // Doubles production
  target: 'mining_drone'   // Which generator to affect
})
```

#### 5. **Upgrades**
One-time or repeatable purchases that enhance gameplay

```typescript
const improvedDrills = new Upgrade({
  id: 'improved_drill_bits',
  name: 'Improved Drill Bits',
  description: 'Mining drones work twice as fast',
  costs: [{ resourceId: 'credits', amount: 50 }],
  effect: () => {
    miningDrone.addMultiplier(droneBoost)
  },
  isVisible: () => miningDrone.purchased >= 1  // Show when player has a drone
})
```

#### 6. **Achievements**
Track player milestones and provide goals

```typescript
const firstMinerals = new Achievement({
  id: 'first_minerals',
  name: 'First Strike',
  description: 'Collect your first minerals',
  condition: () => minerals.amount >= 1,
  isSecret: false  // Set to true to hide until unlocked
})
```

### Project Structure

```
src/
├── core/                    # Framework classes (don't modify these)
│   ├── Resource.ts
│   ├── Generator.ts
│   ├── Upgrade.ts
│   ├── Achievement.ts
│   ├── Multiplier.ts
│   ├── Statistics.ts
│   └── GameEngine.ts
├── stores/                  # Pinia state management
│   └── game.ts
├── components/              # Vue UI components
│   ├── ResourceDisplay.vue
│   ├── GeneratorCard.vue
│   ├── UpgradeCard.vue
│   ├── AchievementCard.vue
│   └── StatisticsPanel.vue
├── games/                   # Your game implementations go here!
│   ├── cookieGame.ts       # Example: Cookie Clicker
│   └── spaceMiningGame.ts  # Example: Space Mining
├── App.vue                  # Main application
└── main.ts                  # Application entry point
```

## Creating Your First Game

Let's create a simple farming game step-by-step!

> **💡 Complete Example**: You can find the full working code for this tutorial in `src/games/farmingGame.ts`

### Step 1: Create the Game File

Create a new file: `src/games/myFarmingGame.ts` (or open `src/games/farmingGame.ts` to follow along)

```typescript
import { GameEngine, Resource, Generator, Upgrade, Achievement, Multiplier } from '../core'

export function createFarmingGame(): GameEngine {
  const engine = new GameEngine({
    tickRate: 100,
    autoSaveInterval: 30000
  })
  
  // We'll add our game logic here
  
  return engine
}
```

### Step 2: Add Resources

```typescript
// Add after creating the engine

const wheat = new Resource({
  id: 'wheat',
  name: 'Wheat',
  description: 'Golden grain from your fields',
  initialAmount: 0,
  displayPrecision: 0
})

const gold = new Resource({
  id: 'gold',
  name: 'Gold Coins',
  description: 'Currency for purchasing upgrades',
  initialAmount: 10,  // Start with some gold
  displayPrecision: 0
})

engine.addResource(wheat)
engine.addResource(gold)
```

### Step 3: Add Generators

```typescript
const farmer = new Generator({
  id: 'farmer',
  name: 'Farmer',
  description: 'A hardworking farmer who grows wheat',
  producesResourceId: 'wheat',
  baseProductionRate: 1,  // 1 wheat per second
  costs: [{ 
    resourceId: 'gold', 
    baseAmount: 10, 
    scalingFactor: 1.15 
  }]
})

const windmill = new Generator({
  id: 'windmill',
  name: 'Windmill',
  description: 'Processes wheat into gold',
  producesResourceId: 'gold',
  baseProductionRate: 0.5,
  costs: [{ 
    resourceId: 'wheat', 
    baseAmount: 50, 
    scalingFactor: 1.2 
  }]
})

engine.addGenerator(farmer)
engine.addGenerator(windmill)
```

### Step 4: Add Upgrades with Multipliers

```typescript
const betterTools = new Multiplier({
  id: 'better_tools',
  name: 'Better Tools',
  description: 'Farmers work faster',
  type: 'multiplicative',
  value: 2,
  target: 'farmer'
})

const toolUpgrade = new Upgrade({
  id: 'tool_upgrade',
  name: 'Better Tools',
  description: 'Farmers work twice as fast',
  costs: [{ resourceId: 'gold', amount: 50 }],
  effect: () => {
    farmer.addMultiplier(betterTools)
  },
  isVisible: () => farmer.purchased >= 1
})

engine.addUpgrade(toolUpgrade)
```

### Step 5: Add Achievements

```typescript
const firstWheat = new Achievement({
  id: 'first_wheat',
  name: 'First Harvest',
  description: 'Collect your first wheat',
  condition: () => wheat.amount >= 1
})

const firstFarmer = new Achievement({
  id: 'first_farmer',
  name: 'Growing Team',
  description: 'Hire your first farmer',
  condition: () => farmer.purchased >= 1
})

engine.addAchievement(firstWheat)
engine.addAchievement(firstFarmer)
```

### Step 6: Connect to the UI

Edit `src/App.vue` to use your new game:

```typescript
// Change the import at the top
import { createFarmingGame } from './games/farmingGame'

// In onMounted, change:
const engine = createFarmingGame()  // Instead of createSpaceMiningGame()
```

Update the header to match your theme:

```vue
<h1>🌾 Farming Empire</h1>
<p class="subtitle">Built with the Modern Idle Game Framework</p>
```

Update the click button:

```vue
<button @click="handleManualClick" class="click-button" aria-label="Click to harvest wheat">
  🌾 Harvest Wheat
</button>
```

And update the click handler function:

```typescript
function handleManualClick() {
  const wheat = gameStore.getResource('wheat')
  if (wheat) {
    wheat.add(1)
    gameStore.engine?.statistics.recordClick()
    gameStore.engine?.statistics.recordResourceEarned('wheat', 1)
  }
}
```

### Step 7: Test Your Game!

```bash
npm run dev
```

You should now see your farming game running! Try:
- Clicking the harvest button
- Buying a farmer
- Watching wheat accumulate automatically
- Purchasing the upgrade when you have enough gold

## Testing Your Game

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Your Code

```bash
npm run lint
```

### Format Your Code

```bash
npm run format
```

## Common Patterns

### Multiple Resource Costs

Generators and upgrades can require multiple resources:

```typescript
const advancedFarm = new Generator({
  id: 'advanced_farm',
  name: 'Advanced Farm',
  description: 'Requires both gold and wheat',
  producesResourceId: 'wheat',
  baseProductionRate: 10,
  costs: [
    { resourceId: 'gold', baseAmount: 500, scalingFactor: 1.15 },
    { resourceId: 'wheat', baseAmount: 100, scalingFactor: 1.1 }
  ]
})
```

### Conditional Visibility

Show upgrades only when certain conditions are met:

```typescript
const lateGameUpgrade = new Upgrade({
  id: 'late_game_upgrade',
  name: 'Advanced Technology',
  description: 'Unlocks at 100 total generators',
  costs: [{ resourceId: 'gold', amount: 10000 }],
  effect: () => { /* ... */ },
  isVisible: () => {
    const total = farmer.purchased + windmill.purchased
    return total >= 100
  }
})
```

### Secret Achievements

Create hidden achievements that surprise players:

```typescript
const secretAchievement = new Achievement({
  id: 'secret_hoarder',
  name: 'Wheat Hoarder',
  description: 'Accumulate 10,000 wheat',
  condition: () => wheat.amount >= 10000,
  isSecret: true  // Hidden until unlocked
})
```

### Global Multipliers

Apply multipliers to multiple generators:

```typescript
const globalBoost = new Multiplier({
  id: 'global_boost',
  name: 'Global Productivity',
  description: 'All production +50%',
  type: 'multiplicative',
  value: 1.5,
  target: null  // null = applies globally
})

// Apply to multiple generators
farmer.addMultiplier(globalBoost)
windmill.addMultiplier(globalBoost)
```

### Stacking Multipliers

Multipliers of the same type stack:

```typescript
// If you add two 2x multiplicative multipliers
// Total effect = 2 × 2 = 4x production
farmer.addMultiplier(multiplier1)  // 2x
farmer.addMultiplier(multiplier2)  // 2x
// farmer now produces 4x the base rate
```

## Troubleshooting

### Game doesn't load
- Check browser console for errors (F12 → Console tab)
- Make sure you called `engine.addResource()` for all resources
- Verify all IDs are unique

### Resources not displaying
- Ensure you added the resource to the engine
- Check that `displayPrecision` is set appropriately
- Verify the resource has a valid `name` property

### Generators not producing
- Make sure the `producesResourceId` matches a resource you added
- Check that the generator's costs can be afforded
- Verify the game engine is started (`gameStore.startGame()`)

### Upgrades not appearing
- Check the `isVisible()` condition - it might not be met yet
- Ensure the upgrade was added to the engine
- Verify resources required for the upgrade exist

### Save/Load not working
- The framework uses `localStorage` - check browser settings
- Save data is namespaced by game name
- Use `gameStore.resetGame()` to clear saved data

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`
- Verify all imports are correct

## Next Steps

Now that you understand the basics:

1. **Explore the Examples**
   - Study `src/games/spaceMiningGame.ts` for a complete game
   - Check `src/games/cookieGame.ts` for different patterns

2. **Customize the UI**
   - Modify `src/App.vue` for different layouts
   - Update `src/style.css` for custom styling
   - Create new Vue components for unique features

3. **Add Advanced Features**
   - Implement prestige systems
   - Add multiple game modes
   - Create complex resource chains
   - Design strategic decision points

4. **Share Your Game**
   - Build for production: `npm run build`
   - Deploy to GitHub Pages, Netlify, or Vercel
   - Share with the community!

## Resources

- **Framework Documentation**: See the main [README.md](./README.md)
- **Vue 3 Docs**: https://vuejs.org/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Pinia Docs**: https://pinia.vuejs.org/

## Need Help?

- Check the example games in `src/games/`
- Review the component implementations in `src/components/`
- Open an issue on GitHub for bugs or questions

Happy game development! 🎮✨
