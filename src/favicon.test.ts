import { describe, expect, it } from 'vitest';
import { NO_ALERTS, UNREACHABLE } from './alerts';
import { faviconAlarm, faviconEntry } from './favicon';

describe('faviconEntry', () => {
  it('shows active alerts in red', () => {
    expect(faviconEntry({ ...NO_ALERTS, active: 2, suppressed: 3 })).toEqual({ color: '#ff0000', text: '2' });
  });

  it('shows suppressed alerts in grey if no alert is active', () => {
    expect(faviconEntry({ ...NO_ALERTS, suppressed: 3 })).toEqual({ color: '#888888', text: '3' });
  });

  it('shows an orange question mark for an unreachable Alertmanager', () => {
    expect(faviconEntry(UNREACHABLE)).toEqual({ color: '#ffa500', text: '?' });
  });

  it('shows a green zero without alerts', () => {
    expect(faviconEntry(NO_ALERTS)).toEqual({ color: '#00ff00', text: '0' });
  });
});

describe('faviconAlarm', () => {
  it('is fatal if any Alertmanager has an active fatal alert', () => {
    expect(faviconAlarm([{ ...NO_ALERTS, active: 1, activeError: 1 }, { ...NO_ALERTS, active: 1, activeFatal: 1 }]))
      .toBe('fatal');
  });

  it('is error if there is an active error but no active fatal alert', () => {
    expect(faviconAlarm([NO_ALERTS, { ...NO_ALERTS, active: 1, activeError: 1 }])).toBe('error');
  });

  it('is no alarm with active warnings or suppressed alerts only', () => {
    expect(faviconAlarm([{ ...NO_ALERTS, active: 3, suppressed: 2 }, NO_ALERTS])).toBeUndefined();
  });
});
