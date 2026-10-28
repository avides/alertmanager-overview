import type { AlertCounts } from './alerts';

export interface FaviconEntry {
  color: string;
  number: number;
}

export type FaviconAlarm = 'fatal' | 'error' | undefined;

const BLINK_INTERVAL = 700;

let blinkTimer: number | undefined;

export function faviconEntry(counts: AlertCounts): FaviconEntry {
  if (counts.active > 0) {
    return { color: '#ff0000', number: counts.active };
  }
  if (counts.suppressed > 0) {
    return { color: '#888888', number: counts.suppressed };
  }
  return { color: '#00ff00', number: 0 };
}

// Active fatal or error alerts turn the whole favicon into an alarm
export function faviconAlarm(rows: AlertCounts[]): FaviconAlarm {
  if (rows.some(counts => counts.activeFatal > 0)) {
    return 'fatal';
  }
  if (rows.some(counts => counts.activeError > 0)) {
    return 'error';
  }
  return undefined;
}

// Draws one line per Alertmanager, with an alarm background the numbers are white
function drawFavicon(rows: AlertCounts[], background: string | undefined): void {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.font = 'bold 8px sans-serif';
  rows.forEach((counts, index) => {
    const entry = faviconEntry(counts);
    ctx.fillStyle = background ? '#ffffff' : entry.color;
    ctx.fillText(String(entry.number), 1, (index + 1) * 8 - 1);
  });

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = canvas.toDataURL('image/png');
}

// Error: red background, fatal: blinks between red and black
export function updateFavicon(rows: AlertCounts[]): void {
  window.clearInterval(blinkTimer);
  blinkTimer = undefined;

  const alarm = faviconAlarm(rows);
  drawFavicon(rows, alarm ? '#ff0000' : undefined);

  if (alarm === 'fatal') {
    let red = true;
    blinkTimer = window.setInterval(() => {
      red = !red;
      drawFavicon(rows, red ? '#ff0000' : '#000000');
    }, BLINK_INTERVAL);
  }
}
