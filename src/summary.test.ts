import { describe, expect, it } from 'vitest';
import { splitNumbers } from './summary';

function numbers(summary: string): string[] {
  return splitNumbers(summary).filter(part => part.number).map(part => part.text);
}

describe('splitNumbers', () => {
  it('splits the summary into text and numbers', () => {
    expect(splitNumbers('Disk usage at 95% on /data')).toEqual([
      { text: 'Disk usage at ', number: false },
      { text: '95', number: true },
      { text: '% on /data', number: false }
    ]);
  });

  it('keeps decimals together and leaves out the units', () => {
    expect(numbers('Load 1.5, latency 500ms, 3,2 GB free')).toEqual(['1.5', '500', '3,2']);
  });

  it('ignores digits within words and versions', () => {
    expect(numbers('host01 runs v1.2 and node_2')).toEqual([]);
  });

  it('returns the summary as one part without numbers', () => {
    expect(splitNumbers('Host down')).toEqual([{ text: 'Host down', number: false }]);
    expect(splitNumbers('')).toEqual([]);
  });
});
