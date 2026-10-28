import type { AlertCounts } from './alerts';

export interface FaviconEntry {
  color: string;
  number: number;
}

export function faviconEntry(counts: AlertCounts): FaviconEntry {
  if (counts.active > 0) {
    return { color: '#ff0000', number: counts.active };
  }
  if (counts.suppressed > 0) {
    return { color: '#888888', number: counts.suppressed };
  }
  return { color: '#00ff00', number: 0 };
}

// Draws one line per Alertmanager into the 16x16 favicon
export function updateFavicon(rows: AlertCounts[]): void {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.font = 'bold 8px sans-serif';
  rows.forEach((counts, index) => {
    const entry = faviconEntry(counts);
    ctx.fillStyle = entry.color;
    ctx.fillText(String(entry.number), 0, (index + 1) * 8);
  });

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = canvas.toDataURL('image/png');
}
