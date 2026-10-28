<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { AlertCounts } from './alerts';
import AlertList from './components/AlertList.vue';
import { updateFavicon } from './favicon';

defineProps<{
  productionUrl: string;
  testUrl: string;
}>();

const counts = reactive({
  production: { active: 0, suppressed: 0 } as AlertCounts,
  test: { active: 0, suppressed: 0 } as AlertCounts
});

watch(counts, () => updateFavicon([counts.production, counts.test]), { immediate: true });
</script>

<template>
  <h1 class="dark-theme-title">Alerts</h1>
  <h2 class="dark-theme-title">Production</h2>
  <AlertList :url="productionUrl" @counts="counts.production = $event" />
  <h2 class="dark-theme-title">Test</h2>
  <AlertList :url="testUrl" @counts="counts.test = $event" />
</template>
