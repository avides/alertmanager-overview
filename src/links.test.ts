import { describe, expect, it } from 'vitest';
import type { Alert } from './alerts';
import { labelFilter, newSilenceUrl, prometheusUrl, silenceUrl } from './links';

function alert(overrides: Partial<Alert> = {}): Alert {
  return {
    fingerprint: 'f1',
    labels: { alertname: 'HostDown', instance: 'host01' },
    annotations: {},
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
  it('links the first silence of the alert', () => {
    const silenced = alert({ status: { state: 'suppressed', silencedBy: ['id-1', 'id-2'] } });

    expect(silenceUrl('http://alertmanager.example.com', silenced)).toBe('http://alertmanager.example.com/#/silences/id-1');
  });

  it('is undefined without silence', () => {
    expect(silenceUrl('http://alertmanager.example.com', alert())).toBeUndefined();
  });
});

describe('prometheusUrl', () => {
  it('uses the generator url of the alert', () => {
    const url = 'http://prometheus.example.com/graph?g0.expr=up';

    expect(prometheusUrl(alert({ generatorURL: url }))).toBe(url);
  });

  it('ignores missing and non http urls', () => {
    expect(prometheusUrl(alert())).toBeUndefined();
    expect(prometheusUrl(alert({ generatorURL: 'javascript:alert(1)' }))).toBeUndefined();
  });
});
