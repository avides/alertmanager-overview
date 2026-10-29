export interface SummaryPart {
  text: string;
  number: boolean;
}

// Numbers standing on their own without their unit, e.g. "95" in "95%", "-12.5" in "-12.5ms", "1,500" or "1e+06" as
// Prometheus renders large values, but not the digits in "host01", "host-01", "v1.2" or "1.2.3": either thousands
// groups or at most one decimal separator, optionally with an exponent
const NUMBER = /(?<![\p{L}\d_.-])-?(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)(?:e[+-]?\d+)?(?![.,]?\d)/giu;

// Splits the summary so the numbers, usually the values filled in by the alert rule, can be highlighted
export function splitNumbers(summary: string): SummaryPart[] {
  const parts: SummaryPart[] = [];
  let index = 0;
  for (const match of summary.matchAll(NUMBER)) {
    if (match.index > index) {
      parts.push({ text: summary.slice(index, match.index), number: false });
    }
    parts.push({ text: match[0], number: true });
    index = match.index + match[0].length;
  }
  if (index < summary.length) {
    parts.push({ text: summary.slice(index), number: false });
  }
  return parts;
}
