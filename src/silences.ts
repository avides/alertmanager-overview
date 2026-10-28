import type { Alert } from './alerts';

export interface Silence {
  id: string;
  createdBy: string;
  comment: string;
  startsAt: string;
  endsAt: string;
  status: {
    state: 'active' | 'pending' | 'expired';
  };
}

export async function fetchSilences(url: string, timeout: number): Promise<Map<string, Silence>> {
  const response = await fetch(`${url}/api/v2/silences`, { signal: AbortSignal.timeout(timeout) });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const silences = (await response.json()) as Silence[];
  return new Map(silences.filter(silence => silence.status.state === 'active').map(silence => [silence.id, silence]));
}

// Of several silences the one that ends last is the one that keeps the alert silenced
export function alertSilence(alert: Alert, silences: Map<string, Silence>): Silence | undefined {
  return alert.status.silencedBy
    .map(id => silences.get(id))
    .filter((silence): silence is Silence => silence !== undefined)
    .reduce<Silence | undefined>((last, silence) =>
      !last || Date.parse(silence.endsAt) > Date.parse(last.endsAt) ? silence : last, undefined);
}
