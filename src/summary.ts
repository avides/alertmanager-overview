export interface SummaryPart {
  text: string;
  number: boolean;
}

// Numbers standing on their own without their unit, e.g. "95" in "95%", "1.5" or "500" in "500ms", but not the digits in "host01" or "v1.2"
const NUMBER = /(?<![\p{L}\d_.-])\d+(?:[.,]\d+)*/gu;

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
