export interface SummaryPart {
  text: string;
  number: boolean;
}

// Digits standing on their own with their separators and exponent, e.g. "95" in "95%", "-12.5" in "-12.5ms", "1.2.3" or
// "1e+06" as Prometheus renders large values, but not the digits in "host01", "host-01" or "v1.2"
const CANDIDATE = /(?<![\p{L}\d_.-])-?\d+(?:[.,]\d+)*(?:e[+-]?\d+)?/giu;

// A candidate is a number with at most one decimal separator or with thousands groups and the other separator for the
// decimals, so "1,500.5" and "1.500,5" are numbers, but "1.2.3" and "192.168.100.1" are not
const NUMBERS = [
  /^-?\d+(?:[.,]\d+)?(?:e[+-]?\d+)?$/i,
  /^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/,
  /^-?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/
];

// Splits the summary so the numbers, usually the values filled in by the alert rule, can be highlighted
export function splitNumbers(summary: string): SummaryPart[] {
  const parts: SummaryPart[] = [];
  let index = 0;
  for (const match of summary.matchAll(CANDIDATE)) {
    if (!NUMBERS.some(number => number.test(match[0]))) {
      continue;
    }
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
