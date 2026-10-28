import { describe, expect, it } from 'vitest';
import type { Alert } from './alerts';
import { labelFilter, newSilenceUrl, prometheusUrl, silenceUrl } from './links';

function alert(overrides: Partial<Alert> = {}): Alert {
  return {
    fingerprint: 'f1',
    labels: { alertname: 'HostDown', instance: 'host01' },
    annotations: {},
    startsAt: '2026-10-28T10:00:00Z',
    status: { state: 'active', silencedBy: [] },
    ...overrides
  };
}

describe('labelFilter', () => {
  it('builds matchers for all labels', () => {
    expect(labelFilter({ alertname: 'HostDown', instance: 'host01' })).toBe('{alertname="HostDown",instance="host01"}');
  });

  it('escapes quotes, backslashes and line breaks', () => {
    expect(labelFilter({ query: 'a"b\\c\nd' })).toBe('{query="a\\"b\\\\c\\nd"}');
  });
});

describe('newSilenceUrl', () => {
  it('opens the silence form with the labels of the alert', () => {
    expect(newSilenceUrl('http://alertmanager.example.com/', alert())).toBe(
      'http://alertmanager.example.com/#/silences/new?filter='
      + encodeURIComponent('{alertname="HostDown",instance="host01"}'));
  });
});

describe('silenceUrl', () => {
  it('links the silence in the Alertmanager UI', () => {
    expect(silenceUrl('http://alertmanager.example.com/', 'id-1')).toBe('http://alertmanager.example.com/#/silences/id-1');
  });
});

describe('prometheusUrl', () => {
  it('opens the graph tab of the generator url', () => {
    const generatorURL = 'http://prometheus.example.com/graph?g0.expr=up%7Bjob%3D%22node%22%7D&g0.tab=1';

    const url = new URL(prometheusUrl(alert({ generatorURL }))!);

    expect(url.origin + url.pathname).toBe('http://prometheus.example.com/graph');
    expect(url.searchParams.get('g0.expr')).toBe('up{job="node"}');
    expect(url.searchParams.get('g0.tab')).toBe('0');
    expect(url.searchParams.get('g0.range_input')).toBe('6h');
  });

  it('ignores missing and non http urls', () => {
    expect(prometheusUrl(alert())).toBeUndefined();
    expect(prometheusUrl(alert({ generatorURL: 'javascript:alert(1)' }))).toBeUndefined();
  });
});
