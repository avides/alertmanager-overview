import { describe, expect, it } from 'vitest';
import { faviconEntry } from './favicon';

describe('faviconEntry', () => {
  it('shows active alerts in red', () => {
    expect(faviconEntry({ active: 2, suppressed: 3 })).toEqual({ color: '#ff0000', number: 2 });
  });

  it('shows suppressed alerts in grey if no alert is active', () => {
    expect(faviconEntry({ active: 0, suppressed: 3 })).toEqual({ color: '#888888', number: 3 });
  });

  it('shows a green zero without alerts', () => {
    expect(faviconEntry({ active: 0, suppressed: 0 })).toEqual({ color: '#00ff00', number: 0 });
  });
});
