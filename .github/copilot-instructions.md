# Copilot Instructions for Modern Idle Game Framework

## Project Overview

This is a modern, extensible framework for building idle/incremental games using Vue 3, TypeScript, and Vite. The framework provides core game systems including resources, generators, upgrades, achievements, multipliers, and statistics tracking.

## Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript with strict type checking
- **State Management**: Pinia stores
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## Code Style and Conventions

### TypeScript
- Use TypeScript for all new files
- Define interfaces for configuration objects (e.g., `ResourceConfig`, `GeneratorConfig`)
- Use `readonly` for properties that shouldn't change after initialization
- Avoid `any` types; use proper typing or `unknown` if necessary
- Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Formatting (Prettier)
- No semicolons (`semi: false`)
- Single quotes for strings (`singleQuote: true`)
- 2 spaces for indentation (`tabWidth: 2`)
- Trailing commas in ES5-compatible contexts (`trailingComma: "es5"`)
- Max line width: 100 characters (`printWidth: 100`)
- Arrow function parentheses: avoid when possible (`arrowParens: "avoid"`)
- Line endings: LF (`endOfLine: "lf"`)

### Vue 3
- Use Composition API with `<script setup lang="ts">`
- Follow Vue 3 recommended practices
- Component names can be single-word (rule disabled in ESLint)
- Use proper TypeScript typing for props and emits

### Naming Conventions
- **Classes**: PascalCase (e.g., `Resource`, `GameEngine`, `Generator`)
- **Interfaces**: PascalCase with descriptive names (e.g., `ResourceConfig`, `GeneratorConfig`)
- **Variables/Functions**: camelCase (e.g., `baseProductionRate`, `canAfford`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: Match the class/component name (e.g., `Resource.ts`, `GeneratorCard.vue`)

## Project Structure

```
src/
├── core/               # Core framework classes (game engine logic)
│   ├── Resource.ts     # Resource management
│   ├── Generator.ts    # Automatic resource generation
│   ├── Upgrade.ts      # One-time or repeatable purchases
│   ├── Achievement.ts  # Player milestones
│   ├── Multiplier.ts   # Production/cost modifiers
│   ├── Statistics.ts   # Player progress tracking
│   ├── GameEngine.ts   # Main orchestrator
│   └── index.ts        # Exports
├── stores/            # Pinia state management
│   └── game.ts        # Main game store
├── components/        # Reusable Vue components
│   ├── ResourceDisplay.vue
│   ├── GeneratorCard.vue
│   ├── UpgradeCard.vue
│   ├── AchievementCard.vue
│   └── StatisticsPanel.vue
├── games/            # Game implementations
│   └── cookieGame.ts # Example game
├── App.vue           # Main app component
└── main.ts          # App entry point
```

## Core Framework Patterns

### Resource Class
- Manages game resources (currency, points, etc.)
- Provides `add()`, `subtract()`, and `canAfford()` methods
- Includes automatic number formatting for large values (K, M, B, T, etc.)
- Example: `const gold = new Resource({ id: 'gold', name: 'Gold', initialAmount: 0 })`

### Generator Class
- Produces resources automatically over time
- Supports multiple cost requirements with exponential scaling
- Includes bulk purchase functionality (buy 1, 10, 100, or max)
- Can be modified by Multiplier instances
- Example: `const miner = new Generator({ id: 'miner', producesResourceId: 'gold', baseProductionRate: 1 })`

### Multiplier Class
- Modifies production rates, costs, or other values
- Two types: `additive` and `multiplicative`
- Can target specific generators or be applied globally
- Example: `new Multiplier({ id: 'boost', type: 'multiplicative', value: 2, target: 'miner' })`

### Upgrade Class
- Represents one-time or repeatable purchases
- Can have visibility conditions
- Effects are executed via callback functions
- Often used to apply multipliers to generators
- Example: `new Upgrade({ id: 'pickaxe', costs: [...], effect: () => { ... } })`

### Achievement Class
- Tracks player milestones
- Uses condition functions checked each game tick
- Supports secret achievements
- Can provide rewards when unlocked
- Example: `new Achievement({ id: 'first_gold', condition: () => gold.amount >= 1 })`

### GameEngine Class
- Central orchestrator for all game systems
- Manages the game loop (tick-based updates)
- Handles save/load functionality with localStorage
- Calculates offline progress
- Integrates statistics tracking
- Example: `const engine = new GameEngine({ tickRate: 100, autoSaveInterval: 30000 })`

## Development Commands

### Run Development Server
```bash
npm run dev
```
Starts Vite development server with hot module replacement.

### Build for Production
```bash
npm run build
```
Runs TypeScript type checking (`vue-tsc -b`) followed by Vite build.

### Lint Code
```bash
npm run lint
```
Runs ESLint with auto-fix on all `.vue`, `.js`, `.ts`, and related files.

### Format Code
```bash
npm run format
```
Runs Prettier on the `src/` directory to format all files.

## Accessibility Guidelines

This framework prioritizes accessibility. When working on UI components:
- Add ARIA labels to all interactive elements
- Support keyboard navigation
- Include screen reader announcements for important updates
- Support high contrast mode
- Respect `prefers-reduced-motion` for animations
- Manage focus properly

## Best Practices

### When Adding New Features
1. **Type Safety**: Always define TypeScript interfaces for configuration objects
2. **Consistency**: Follow existing patterns in similar classes
3. **Documentation**: Add JSDoc comments for public APIs
4. **Testing**: Ensure new features work with the existing demo game
5. **Accessibility**: Consider screen readers and keyboard navigation

### When Modifying Core Classes
- Maintain backward compatibility where possible
- Update the example game (`cookieGame.ts`) if API changes
- Preserve existing configuration interface properties
- Keep methods pure and side-effect-free when possible

### State Management
- Use Pinia stores for reactive state
- Keep game logic in core classes, not in stores
- Stores should orchestrate core classes, not duplicate logic

### Error Handling
- Use console.warn for recoverable issues
- Use console.error for critical problems
- Validate user input and configuration objects
- Return boolean success indicators where appropriate

## Common Tasks

### Adding a New Resource Type
1. Create instance in game file: `new Resource({ id, name, description, initialAmount })`
2. Add to GameEngine: `engine.addResource(resource)`
3. Update UI components as needed

### Adding a New Generator
1. Create instance: `new Generator({ id, name, producesResourceId, baseProductionRate, costs })`
2. Add to GameEngine: `engine.addGenerator(generator)`
3. Component will automatically render it via `GeneratorCard.vue`

### Creating a Multiplier Effect
1. Create multiplier: `new Multiplier({ id, type, value, target })`
2. Apply to generator: `generator.addMultiplier(multiplier)`
3. Typically done in upgrade effect callbacks

### Adding Game Statistics
- Statistics are automatically tracked by the GameEngine
- Access via `engine.statistics` or game store
- Includes: resources earned/spent, time played, clicks, purchases, etc.

## Testing Approach

Currently, testing is done manually via the demo game:
1. Make changes to core classes or components
2. Run `npm run dev`
3. Test in the browser with the cookie game example
4. Verify functionality works as expected

## Notes for AI Assistance

- Prioritize type safety and follow existing TypeScript patterns
- When modifying core classes, ensure changes are minimal and focused
- Always run `npm run lint` and `npm run format` before committing
- Check that changes work with the existing demo game
- Maintain consistency with the established code style (no semicolons, single quotes, etc.)
