<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { type Alert, type AlertCounts, alertLevel, countAlerts, fetchAlerts, sortAlerts } from '../alerts';
import { newSilenceUrl, prometheusUrl, silenceUrl } from '../links';
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
        <span class="summary">{{ alert.annotations.summary }}</span>
        <a v-if="alert.status.state === 'active'" class="action" :href="newSilenceUrl(url, alert)"
          target="_blank" rel="noopener" title="Create silence">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M8 1.5a4 4 0 0 0-4 4v3L2.5 11h11L12 8.5v-3a4 4 0 0 0-4-4zM6.5 12.5a1.5 1.5 0 0 0 3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
            <path d="M2 2l12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </a>
        <a v-else-if="silenceUrl(url, alert)" class="action" :href="silenceUrl(url, alert)"
          target="_blank" rel="noopener" title="Show silence">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M8 1.5a4 4 0 0 0-4 4v3L2.5 11h11L12 8.5v-3a4 4 0 0 0-4-4zM6.5 12.5a1.5 1.5 0 0 0 3 0" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
            <path d="M2 2l12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </a>
        <span v-else class="action" />
        <a v-if="prometheusUrl(alert)" class="action" :href="prometheusUrl(alert)"
          target="_blank" rel="noopener" title="Show in Prometheus">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M1.5 14.5h13M2.5 11l3.5-4 3 2.5 4.5-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <span v-else class="action" />
      </div>
    </li>
  </ul>
</template>
