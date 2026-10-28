import type { Alert } from './alerts';

function baseUrl(alertmanagerUrl: string): string {
  return alertmanagerUrl.replace(/\/+$/, '');
}

function escapeLabelValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
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

// The first silence that suppresses the alert, undefined if it is not silenced (e.g. only inhibited)
export function silenceUrl(alertmanagerUrl: string, alert: Alert): string | undefined {
  const silenceId = alert.status.silencedBy?.[0];
  return silenceId ? `${baseUrl(alertmanagerUrl)}/#/silences/${encodeURIComponent(silenceId)}` : undefined;
}

// The graph of the alert rule in Prometheus, only http(s) links are used
export function prometheusUrl(alert: Alert): string | undefined {
  if (!/^https?:\/\//.test(alert.generatorURL ?? '')) {
    return undefined;
  }
  const url = new URL(alert.generatorURL!);
  // Prometheus links to the table, 0 opens the graph tab (old and new Prometheus UI)
  url.searchParams.set('g0.tab', '0');
  return url.toString();
}
