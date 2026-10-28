<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { type Alert, type AlertCounts, alertLevel, countAlerts, fetchAlerts, sortAlerts } from '../alerts';
import LevelIcon from './LevelIcon.vue';

const props = withDefaults(defineProps<{
  url: string;
  refresh?: number;
}>(), {
  refresh: 10000
});

const emit = defineEmits<{
  counts: [counts: AlertCounts];
}>();

const alerts = ref<Alert[]>([]);
const unreachable = ref(false);
let timer: number | undefined;

async function update(): Promise<void> {
  try {
    alerts.value = sortAlerts(await fetchAlerts(props.url));
    unreachable.value = false;
    emit('counts', countAlerts(alerts.value));
  } catch (error) {
    console.error(`Loading alerts from ${props.url} failed`, error);
    unreachable.value = true;
  }
}

onMounted(() => {
  void update();
  timer = window.setInterval(update, props.refresh);
});

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <ul class="alerts">
    <li v-if="unreachable" class="alert">
      <div class="unreachable"><span>Alertmanager not reachable: {{ url }}</span></div>
    </li>
    <li v-else-if="!alerts.length" class="alert">
      <div class="no-alert"><span>No alerts</span></div>
    </li>
    <li v-for="alert in alerts" :key="alert.fingerprint" class="alert">
      <div :class="alert.status.state">
        <LevelIcon :level="alertLevel(alert)" :description="alert.annotations.description" />
        <span>{{ alert.annotations.summary }}</span>
      </div>
    </li>
  </ul>
</template>
