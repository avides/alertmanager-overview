export type AlertState = 'unprocessed' | 'active' | 'suppressed';

export type AlertLevel = 'fatal' | 'error' | 'warn' | 'info';

const ALERT_LEVELS: readonly string[] = ['fatal', 'error', 'warn', 'info'];

export interface Alert {
  fingerprint: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  generatorURL?: string;
  startsAt: string;
  status: {
    state: AlertState;
    silencedBy: string[];
  };
}

export interface AlertCounts {
  active: number;
  suppressed: number;
  activeFatal: number;
  activeError: number;
  unreachable: boolean;
}

export async function fetchAlerts(url: string): Promise<Alert[]> {
  const response = await fetch(`${url}/api/v2/alerts`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Alert[];
}

// Alerts without a known level are sorted after all levels
function levelRank(alert: Alert): number {
  const level = alertLevel(alert);
  return level ? ALERT_LEVELS.indexOf(level) : ALERT_LEVELS.length;
}

// Active alerts first, then by level from fatal to info, then alphabetically by summary
export function sortAlerts(alerts: Alert[]): Alert[] {
  return [...alerts].sort((x, y) =>
    Number(y.status.state === 'active') - Number(x.status.state === 'active')
    || levelRank(x) - levelRank(y)
    || (x.annotations.summary ?? '').localeCompare(y.annotations.summary ?? ''));
}

// The level is set by the label "level" of the Prometheus alert rules
export function alertLevel(alert: Alert): AlertLevel | undefined {
  const level = alert.labels.level;
  return ALERT_LEVELS.includes(level) ? (level as AlertLevel) : undefined;
}

export function countAlerts(alerts: Alert[]): AlertCounts {
  const active = alerts.filter(alert => alert.status.state === 'active');
  return {
    active: active.length,
    suppressed: alerts.filter(alert => alert.status.state === 'suppressed').length,
    activeFatal: active.filter(alert => alertLevel(alert) === 'fatal').length,
    activeError: active.filter(alert => alertLevel(alert) === 'error').length,
    unreachable: false
  };
}

export const NO_ALERTS: AlertCounts = { active: 0, suppressed: 0, activeFatal: 0, activeError: 0, unreachable: false };

export const UNREACHABLE: AlertCounts = { ...NO_ALERTS, unreachable: true };
