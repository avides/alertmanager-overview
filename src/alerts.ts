export type AlertState = 'unprocessed' | 'active' | 'suppressed';

export interface Alert {
  fingerprint: string;
  annotations: Record<string, string>;
  status: {
    state: AlertState;
  };
}

export interface AlertCounts {
  active: number;
  suppressed: number;
}

export async function fetchAlerts(url: string): Promise<Alert[]> {
  const response = await fetch(`${url}/api/v2/alerts`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as Alert[];
}

// Active alerts first, the order within a state is kept
export function sortAlerts(alerts: Alert[]): Alert[] {
  return [...alerts].sort((x, y) => Number(y.status.state === 'active') - Number(x.status.state === 'active'));
}

export function countAlerts(alerts: Alert[]): AlertCounts {
  return {
    active: alerts.filter(alert => alert.status.state === 'active').length,
    suppressed: alerts.filter(alert => alert.status.state === 'suppressed').length
  };
}
