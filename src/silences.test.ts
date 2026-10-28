import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Alert } from './alerts';
import { alertSilence, fetchSilences, type Silence } from './silences';

function silence(id: string, endsAt: string, state: Silence['status']['state'] = 'active'): Silence {
  return { id, createdBy: 'max', comment: 'maintenance', startsAt: '2026-10-28T08:00:00Z', endsAt, status: { state } };
}

function silencedAlert(silencedBy: string[]): Alert {
  return {
    fingerprint: 'f1',
    labels: {},
    annotations: {},
    startsAt: '2026-10-28T08:00:00Z',
    status: { state: 'suppressed', silencedBy }
  };
}

describe('fetchSilences', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the active silences by id', async () => {
    const silences = [silence('s1', '2026-10-29T08:00:00Z'), silence('s2', '2026-10-27T08:00:00Z', 'expired')];
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(silences)));
    vi.stubGlobal('fetch', fetchMock);

    const loaded = await fetchSilences('http://alertmanager.example.com', 1000);

    expect(fetchMock).toHaveBeenCalledWith('http://alertmanager.example.com/api/v2/silences', { signal: expect.any(AbortSignal) });
    expect([...loaded.keys()]).toEqual(['s1']);
  });

  it('fails on an http error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));

    await expect(fetchSilences('http://alertmanager.example.com', 1000)).rejects.toThrow('HTTP 503');
  });
});

describe('alertSilence', () => {
  const silences = new Map([
    ['s1', silence('s1', '2026-10-29T08:00:00Z')],
    ['s2', silence('s2', '2026-10-30T08:00:00Z')]
  ]);

  it('returns the silence that ends last', () => {
    expect(alertSilence(silencedAlert(['s1', 's2']), silences)?.id).toBe('s2');
  });

  it('ignores unknown silences', () => {
    expect(alertSilence(silencedAlert(['unknown', 's1']), silences)?.id).toBe('s1');
  });

  it('is undefined for an alert without silence', () => {
    expect(alertSilence(silencedAlert([]), silences)).toBeUndefined();
  });
});
