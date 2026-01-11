# Developer Guide - Framework Architecture

This guide explains the internal architecture of the Modern Idle Game Framework, design patterns, and best practices for extending or modifying the framework.

## Table of Contents

1. [Framework Architecture](#framework-architecture)
2. [Core Systems](#core-systems)
3. [State Management](#state-management)
4. [Component Design](#component-design)
5. [Best Practices](#best-practices)
6. [Extending the Framework](#extending-the-framework)
7. [Performance Considerations](#performance-considerations)

## Framework Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                    Vue App (App.vue)                │
│  - UI Layout                                        │
│  - Manual click handling                            │
│  - Component composition                            │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ uses
                  ▼
┌─────────────────────────────────────────────────────┐
│              Pinia Store (game.ts)                  │
│  - State management                                 │
│  - Computed properties                              │
│  - Action dispatching                               │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ manages
                  ▼
┌─────────────────────────────────────────────────────┐
│              GameEngine (core/)                     │
│  - Game loop orchestration                          │
│  - Tick processing                                  │
│  - Save/Load system                                 │
│  - Offline progress                                 │
│  - Resource/Generator/Upgrade/Achievement registry  │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ contains
                  ▼
┌─────────────────────────────────────────────────────┐
│           Game Entities (core/)                     │
│  - Resource      - Multiplier                       │
│  - Generator     - Statistics                       │
│  - Upgrade       - Achievement                      │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Store Action → GameEngine → Entity Method → State Update
     ↓                                                                      ↓
     └──────────────────── Reactivity (Vue) ────────────────────────────────┘
```

## Core Systems

### GameEngine

**Purpose**: Central orchestrator for all game systems

**Key Responsibilities**:
- Managing the game loop (tick-based updates)
- Coordinating resource production from generators
- Checking achievement conditions
- Handling save/load operations
- Calculating offline progress
- Tracking statistics

**Key Methods**:
```typescript
start()              // Begin the game loop
stop()               // Pause the game loop
tick()               // Process one game tick
save()               // Serialize game state to localStorage
load()               // Deserialize game state from localStorage
reset()              // Clear all progress
calculateOfflineProgress(offlineTime: number)  // Handle time away
```

**Design Pattern**: Singleton-like behavior through Pinia store

### Resource

**Purpose**: Represents a collectible/spendable game resource

**Key Features**:
- Amount tracking with optional maximum
- Display formatting (K, M, B, T, etc.)
- Add/subtract operations with validation
- Serialization support

**Number Formatting**:
```typescript
// Resource.ts
getDisplayAmount(): string {
  // 1000 → "1.00K"
  // 1000000 → "1.00M"
  // etc.
}
```

### Generator

**Purpose**: Automated resource production

**Key Concepts**:
- **Base Production Rate**: Amount produced per second
- **Cost Scaling**: Exponential cost growth (e.g., `cost = baseCost × scalingFactor^purchased`)
- **Multipliers**: Applied to base production rate
- **Bulk Purchase**: Buy multiple at once with proper cost calculation

**Production Calculation**:
```typescript
getCurrentProduction(): number {
  let production = this.baseProductionRate
  
  // Apply all active multipliers
  for (const multiplier of this.multipliers) {
    if (multiplier.active) {
      production = multiplier.apply(production)
    }
  }
  
  return production * this.purchased
}
```

**Cost Calculation**:
```typescript
// For buying 'n' generators:
// Total cost = baseCost × (scalingFactor^current + scalingFactor^(current+1) + ... + scalingFactor^(current+n-1))
// This is a geometric series
```

### Multiplier

**Purpose**: Modify values (production rates, costs, etc.)

**Types**:
1. **Additive**: `newValue = baseValue + multiplierValue`
2. **Multiplicative**: `newValue = baseValue × multiplierValue`

**Stacking**:
```typescript
// Multiple multipliers apply in sequence:
// Base: 10
// Multiplier 1 (×2): 10 × 2 = 20
// Multiplier 2 (×2): 20 × 2 = 40
// Result: 4x total
```

### Upgrade

**Purpose**: One-time or repeatable purchases that modify game state

**Key Features**:
- Custom effects (can do anything!)
- Visibility conditions (unlocks)
- Purchase limits
- Cost requirements

**Common Patterns**:
```typescript
// Pattern 1: Add a multiplier
effect: () => {
  generator.addMultiplier(multiplier)
}

// Pattern 2: Modify global state
effect: () => {
  manualClickPower += 1
}

// Pattern 3: Unlock new content
effect: () => {
  newGenerator.unlock()
}
```

### Achievement

**Purpose**: Track player milestones and provide goals

**Key Features**:
- Condition checking (runs every tick)
- Secret achievements (hidden until unlocked)
- Optional rewards

**Best Practices**:
- Keep condition functions lightweight (they run frequently)
- Use incremental checks when possible
- Consider caching expensive calculations

### Statistics

**Purpose**: Track player progress and metrics

**Tracked Metrics**:
- Time played
- Total clicks
- Resources earned/spent
- Generators/upgrades purchased
- Achievements unlocked

**Usage**:
```typescript
gameStore.engine?.statistics.recordClick()
gameStore.engine?.statistics.recordResourceEarned('gold', 10)
```

## State Management

### Pinia Store Architecture

The `game.ts` store follows Vue/Pinia conventions:

```typescript
export const useGameStore = defineStore('game', () => {
  // State (refs)
  const engine = ref<GameEngine | null>(null)
  const isRunning = ref(false)
  
  // Computed properties (computed)
  const resources = computed(() => engine.value?.getAllResources() ?? [])
  
  // Actions (functions)
  function startGame() { ... }
  
  return { /* exported items */ }
})
```

**Why this pattern?**
- Vue 3 Composition API style (modern)
- Type-safe
- Reactive
- Easy to test

### Reactivity

The framework leverages Vue's reactivity system:

```typescript
// Changes to resources automatically update the UI
resource.add(10)  // UI updates automatically

// Computed properties stay in sync
const totalProduction = computed(() => 
  generators.value.reduce((sum, g) => sum + g.getCurrentProduction(), 0)
)
```

## Component Design

### Component Hierarchy

```
App.vue
├── ResourceDisplay.vue (for each resource)
├── GeneratorCard.vue (for each generator)
├── UpgradeCard.vue (for each upgrade)
├── AchievementCard.vue (for each achievement)
└── StatisticsPanel.vue
```

### Component Props Pattern

All components follow the same pattern:

```typescript
// Props: Pass data in
defineProps<{
  resource: Resource
  // ... other props
}>()

// Emits: Send events out
const emit = defineEmits<{
  purchase: [id: string, quantity: number]
}>()
```

**Benefits**:
- Unidirectional data flow
- Easy to reason about
- Testable

### Accessibility

All components include:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

**Example**:
```vue
<button 
  @click="purchase" 
  :disabled="!canAfford"
  :aria-label="`Purchase ${generator.name} for ${cost}`"
>
  Purchase
</button>
```

## Best Practices

### Game Design

1. **Start Simple**: Give players something to do immediately (manual clicks)
2. **Progressive Complexity**: Unlock features gradually
3. **Clear Goals**: Use achievements to guide players
4. **Balanced Economy**: Test resource costs and production rates
5. **Strategic Choices**: Give players meaningful decisions

### Code Organization

1. **One game per file**: Keep game definitions in `src/games/`
2. **Descriptive IDs**: Use clear, consistent naming (e.g., `mining_drone`, not `md1`)
3. **Comments**: Explain complex calculations or game mechanics
4. **Constants**: Define magic numbers as named constants

### Performance

1. **Lightweight conditions**: Achievement checks run every tick
2. **Memoization**: Use computed properties for expensive calculations
3. **Bulk operations**: Process multiple items together when possible

### Testing

1. **Manual testing**: Play your game! Does it feel good?
2. **Edge cases**: Test buying max, reset, save/load
3. **Balance**: Check early, mid, and late game pacing

## Extending the Framework

### Adding New Core Features

Want to add a new game system? Follow this pattern:

1. **Create the class** in `src/core/`:
```typescript
// NewFeature.ts
export interface NewFeatureConfig {
  id: string
  name: string
  // ... config
}

export class NewFeature {
  // ... implementation
  
  toJSON() { /* serialization */ }
  fromJSON(data: any) { /* deserialization */ }
}
```

2. **Register in GameEngine**:
```typescript
// GameEngine.ts
private newFeatures: Map<string, NewFeature> = new Map()

addNewFeature(feature: NewFeature) {
  this.newFeatures.set(feature.id, feature)
}

getAllNewFeatures(): NewFeature[] {
  return Array.from(this.newFeatures.values())
}
```

3. **Export from index**:
```typescript
// core/index.ts
export { NewFeature, type NewFeatureConfig } from './NewFeature'
```

4. **Create a component**:
```vue
<!-- NewFeatureCard.vue -->
<template>
  <!-- UI for your feature -->
</template>
```

5. **Update store** (if needed):
```typescript
// stores/game.ts
const newFeatures = computed(() => 
  engine.value?.getAllNewFeatures() ?? []
)
```

### Custom Components

To create game-specific components:

```vue
<!-- src/components/CustomComponent.vue -->
<script setup lang="ts">
import type { Resource } from '../core'

const props = defineProps<{
  resources: Resource[]
}>()

// Your custom logic
</script>

<template>
  <!-- Your custom UI -->
</template>

<style scoped>
/* Your custom styles */
</style>
```

Then use it in `App.vue`:

```vue
<script setup lang="ts">
import CustomComponent from './components/CustomComponent.vue'
</script>

<template>
  <CustomComponent :resources="gameStore.resources" />
</template>
```

## Performance Considerations

### Game Loop

The game loop runs at `tickRate` frequency (default: 100ms = 10 FPS):

```typescript
// Each tick:
1. Generate resources (for each generator)
2. Check achievements (for each achievement)
3. Update statistics
4. Trigger Vue reactivity
```

**Optimization tips**:
- Keep generator count reasonable (< 100 types)
- Optimize achievement conditions
- Avoid heavy calculations in tick

### Save/Load

- **Auto-save**: Runs every 30 seconds by default
- **Storage**: Uses `localStorage` (typically 5-10MB limit)
- **Size**: Minimize saved data (only IDs and counts, not entire objects)

**Serialization pattern**:
```typescript
toJSON() {
  return {
    id: this.id,
    purchased: this.purchased
    // Only save state, not config
  }
}
```

### Memory Management

- **Clean up timers**: Use `onUnmounted` to stop the game loop
- **Avoid memory leaks**: Clear intervals/timeouts
- **Limit history**: Don't store unbounded arrays

## Summary

The framework provides a solid foundation for idle games with:
- Clean separation of concerns (Engine → Entities → Components)
- Type-safe TypeScript implementation
- Reactive Vue 3 UI
- Extensible architecture
- Save/load and offline progress
- Comprehensive statistics tracking

Focus on game design and let the framework handle the infrastructure!

## Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Idle Game Design Guide](https://www.gamedeveloper.com/design/the-math-of-idle-games)

---

**Questions or suggestions?** Open an issue on GitHub!
