const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Compact duration with the two largest units, e.g. "2d 4h", "3h 12m", "5m"
export function formatDuration(milliseconds: number): string {
  if (milliseconds < MINUTE) {
    return '<1m';
  }
  const days = Math.floor(milliseconds / DAY);
  const hours = Math.floor((milliseconds % DAY) / HOUR);
  const minutes = Math.floor((milliseconds % HOUR) / MINUTE);
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// The preferred languages of the browser settings, which can differ from the language of the browser itself
export function userLocales(): readonly string[] {
  return navigator.languages;
}

// The time only for today, otherwise with the date and with the year if it is not the current one
export function formatTime(date: Date, now: Date, locale: Intl.LocalesArgument = userLocales()): string {
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === now.toDateString()) {
    return time;
  }
  const year = date.getFullYear() === now.getFullYear() ? undefined : 'numeric';
  return `${date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year })} ${time}`;
}

export function formatDateTime(date: Date, locale: Intl.LocalesArgument = userLocales()): string {
  return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}
