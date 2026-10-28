import { afterEach, describe, expect, it, vi } from 'vitest';
import { type Alert, type AlertState, alertLevel, countAlerts, fetchAlerts, sortAlerts } from './alerts';

function alert(fingerprint: string, state: AlertState, summary = fingerprint): Alert {
  return { fingerprint, labels: {}, annotations: { summary }, status: { state } };
}

describe('sortAlerts', () => {
  it('puts active alerts first and sorts alphabetically by summary', () => {
    const sorted = sortAlerts([
      alert('s1', 'suppressed', 'Disk full'),
      alert('a1', 'active', 'Queue too slow'),
      alert('u1', 'unprocessed', 'CPU high'),
      alert('a2', 'active', 'Host down'),
      alert('s2', 'suppressed', 'Backup failed')
    ]);

    expect(sorted.map(a => a.fingerprint)).toEqual(['a2', 'a1', 's2', 'u1', 's1']);
  });

  it('sorts alerts without summary first', () => {
    const withoutSummary: Alert = { fingerprint: 'n1', labels: {}, annotations: {}, status: { state: 'suppressed' } };

    const sorted = sortAlerts([alert('s1', 'suppressed', 'Disk full'), withoutSummary]);

    expect(sorted.map(a => a.fingerprint)).toEqual(['n1', 's1']);
  });

  it('does not modify the given array', () => {
    const alerts = [alert('s1', 'suppressed'), alert('a1', 'active')];

    sortAlerts(alerts);

    expect(alerts.map(a => a.fingerprint)).toEqual(['s1', 'a1']);
  });
});

describe('alertLevel', () => {
  it('reads the level from the label', () => {
    expect(alertLevel({ ...alert('a1', 'active'), labels: { level: 'fatal' } })).toBe('fatal');
  });

  it('ignores missing and unknown levels', () => {
    expect(alertLevel(alert('a1', 'active'))).toBeUndefined();
    expect(alertLevel({ ...alert('a1', 'active'), labels: { level: 'critical' } })).toBeUndefined();
  });
});

describe('countAlerts', () => {
  it('counts active and suppressed alerts', () => {
    const counts = countAlerts([
      alert('a1', 'active'),
      alert('a2', 'active'),
      alert('s1', 'suppressed'),
      alert('u1', 'unprocessed')
    ]);

    expect(counts).toEqual({ active: 2, suppressed: 1 });
  });
});

describe('fetchAlerts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the alerts from the v2 api', async () => {
    const alerts = [alert('a1', 'active')];
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(alerts)));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchAlerts('http://alertmanager.example.com')).resolves.toEqual(alerts);
    expect(fetchMock).toHaveBeenCalledWith('http://alertmanager.example.com/api/v2/alerts');
  });

  it('fails on an http error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));

    await expect(fetchAlerts('http://alertmanager.example.com')).rejects.toThrow('HTTP 503');
  });
});
