<script setup lang="ts">
import type { AlertLevel } from '../alerts';

defineProps<{
  level: AlertLevel | undefined;
  description?: string;
}>();
</script>

<template>
  <svg class="level-icon" viewBox="0 0 16 16" width="18" height="18" role="img" :aria-label="level ?? 'unknown'">
    <title>{{ description || level || 'unknown' }}</title>
    <template v-if="level === 'fatal'">
      <polygon points="5.1,1 10.9,1 15,5.1 15,10.9 10.9,15 5.1,15 1,10.9 1,5.1" fill="#1a1a1a" stroke="white" stroke-width="1.2" />
      <path d="M5.5 5.5 L10.5 10.5 M10.5 5.5 L5.5 10.5" stroke="white" stroke-width="2" stroke-linecap="round" />
    </template>
    <template v-else-if="level === 'error'">
      <circle cx="8" cy="8" r="7" fill="#b00020" stroke="white" stroke-width="1.2" />
      <rect x="7" y="3.5" width="2" height="6" rx="1" fill="white" />
      <circle cx="8" cy="12" r="1.1" fill="white" />
    </template>
    <template v-else-if="level === 'warn'">
      <path d="M8 1.2 L15.2 14.6 H0.8 Z" fill="#ffb300" stroke="white" stroke-width="1.2" stroke-linejoin="round" />
      <rect x="7" y="5.5" width="2" height="5" rx="1" fill="black" />
      <circle cx="8" cy="12.4" r="1" fill="black" />
    </template>
    <template v-else-if="level === 'info'">
      <circle cx="8" cy="8" r="7" fill="#1e88e5" stroke="white" stroke-width="1.2" />
      <circle cx="8" cy="4.6" r="1.1" fill="white" />
      <rect x="7" y="6.5" width="2" height="6" rx="1" fill="white" />
    </template>
    <template v-else>
      <circle cx="8" cy="8" r="7" fill="#757575" stroke="white" stroke-width="1.2" />
      <text x="8" y="12" text-anchor="middle" font-size="11" font-weight="bold" fill="white">?</text>
    </template>
  </svg>
</template>
