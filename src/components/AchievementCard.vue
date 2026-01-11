<script setup lang="ts">
import type { Achievement } from '../core'

defineProps<{
  achievement: Achievement
}>()
</script>

<template>
  <div
    class="achievement-card"
    :class="{ unlocked: achievement.unlocked }"
    role="listitem"
    :aria-label="`${achievement.unlocked ? 'Unlocked' : 'Locked'} achievement: ${achievement.isSecret && !achievement.unlocked ? 'Secret Achievement' : achievement.name}`"
  >
    <div class="achievement-icon" aria-hidden="true">
      <span v-if="achievement.unlocked">🏆</span>
      <span v-else-if="achievement.isSecret">❓</span>
      <span v-else>🔒</span>
    </div>
    <div class="achievement-content">
      <h4 class="achievement-name">
        {{
          achievement.isSecret && !achievement.unlocked ? 'Secret Achievement' : achievement.name
        }}
      </h4>
      <p class="achievement-description">
        {{ achievement.isSecret && !achievement.unlocked ? '???' : achievement.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.achievement-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.achievement-card.unlocked {
  background: #fff3cd;
  border-color: #ffc107;
}

.achievement-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.achievement-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>
