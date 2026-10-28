<script setup lang="ts">
import { reactive, watch } from 'vue';
import { type AlertCounts, NO_ALERTS } from './alerts';
import AlertList from './components/AlertList.vue';
import { updateFavicon } from './favicon';

defineProps<{
  productionUrl: string;
  testUrl: string;
}>();

const counts = reactive({
  production: NO_ALERTS as AlertCounts,
  test: NO_ALERTS as AlertCounts
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
