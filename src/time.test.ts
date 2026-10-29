import { describe, expect, it } from 'vitest';
import { formatDateTime, formatDuration, formatTime } from './time';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('formatDuration', () => {
  it('shows less than a minute', () => {
    expect(formatDuration(30 * 1000)).toBe('<1m');
  });

  it('shows minutes', () => {
    expect(formatDuration(5 * MINUTE + 30 * 1000)).toBe('5m');
  });

  it('shows hours and minutes', () => {
    expect(formatDuration(3 * HOUR + 12 * MINUTE)).toBe('3h 12m');
  });

  it('shows days and hours', () => {
    expect(formatDuration(2 * DAY + 4 * HOUR + 30 * MINUTE)).toBe('2d 4h');
  });
});

describe('formatTime', () => {
  const now = new Date(2026, 9, 28, 12, 0);

  it('shows only the time for today', () => {
    expect(formatTime(new Date(2026, 9, 28, 14, 5), now, 'de-DE')).toBe('14:05');
  });

  it('shows the date for another day', () => {
    expect(formatTime(new Date(2026, 9, 29, 9, 30), now, 'de-DE')).toBe('29.10. 09:30');
  });

  it('shows the year for another year', () => {
    expect(formatTime(new Date(2043, 6, 19, 21, 23), now, 'de-DE')).toBe('19.07.2043 21:23');
  });
});

describe('formatDateTime', () => {
  it('shows the date and time in the format of the locale', () => {
    expect(formatDateTime(new Date(2026, 9, 28, 14, 5), 'de-DE')).toBe('28.10.2026, 14:05');
    expect(formatDateTime(new Date(2026, 9, 28, 14, 5), 'en-US')).toBe('Oct 28, 2026, 2:05 PM');
  });
});
