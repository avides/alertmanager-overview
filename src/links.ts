import type { Alert } from './alerts';

const PROMETHEUS_GRAPH_RANGE = '6h';

function baseUrl(alertmanagerUrl: string): string {
  let url = alertmanagerUrl;
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}

function escapeLabelValue(value: string): string {
  return value.replaceAll('\\', String.raw`\\`).replaceAll('"', String.raw`\"`).replaceAll('\n', String.raw`\n`);
}

// Matchers in the notation of the Alertmanager UI, e.g. {alertname="HostDown",instance="host01"}
export function labelFilter(labels: Record<string, string>): string {
  const matchers = Object.entries(labels).map(([name, value]) => `${name}="${escapeLabelValue(value)}"`);
  return `{${matchers.join(',')}}`;
}

// Opens the form of the Alertmanager UI with all labels of the alert as matchers
export function newSilenceUrl(alertmanagerUrl: string, alert: Alert): string {
  return `${baseUrl(alertmanagerUrl)}/#/silences/new?filter=${encodeURIComponent(labelFilter(alert.labels))}`;
}

export function silenceUrl(alertmanagerUrl: string, silenceId: string): string {
  return `${baseUrl(alertmanagerUrl)}/#/silences/${encodeURIComponent(silenceId)}`;
}

// The graph of the alert rule in Prometheus, only http(s) links are used
export function prometheusUrl(alert: Alert): string | undefined {
  if (!/^https?:\/\//.test(alert.generatorURL ?? '')) {
    return undefined;
  }
  const url = new URL(alert.generatorURL!);
  // Prometheus links to the table, 0 opens the graph tab (old and new Prometheus UI)
  url.searchParams.set('g0.tab', '0');
  url.searchParams.set('g0.range_input', PROMETHEUS_GRAPH_RANGE);
  return url.toString();
}
