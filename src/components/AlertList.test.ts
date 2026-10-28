// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Alert } from '../alerts';
import AlertList from './AlertList.vue';

const ALERT: Alert = {
  fingerprint: 'f1',
  labels: { alertname: 'HostDown', level: 'error' },
  annotations: { summary: 'Host down' },
  startsAt: '2026-10-28T10:00:00Z',
  status: { state: 'active', silencedBy: [] }
};

describe('AlertList', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the alerts while the silences are still loading', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => url.endsWith('/api/v2/silences')
      ? new Promise<Response>(() => undefined)
      : Promise.resolve(new Response(JSON.stringify([ALERT])))));

    const wrapper = mount(AlertList, { props: { url: 'http://alertmanager.example.com' } });
    await flushPromises();

    expect(wrapper.text()).toContain('Host down');
    expect(wrapper.text()).not.toContain('No alerts');
    expect(wrapper.emitted('counts')?.[0]).toEqual([expect.objectContaining({ active: 1, activeError: 1 })]);
    wrapper.unmount();
  });

  it('shows an unreachable Alertmanager', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const wrapper = mount(AlertList, { props: { url: 'http://alertmanager.example.com' } });
    await flushPromises();

    expect(wrapper.text()).toContain('Alertmanager not reachable');
    expect(wrapper.emitted('counts')?.[0]).toEqual([expect.objectContaining({ unreachable: true })]);
    wrapper.unmount();
  });
});
