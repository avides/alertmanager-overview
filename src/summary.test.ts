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

  it('keeps thousands separators and negative numbers', () => {
    expect(numbers('Queue has 1,500 messages, 1.234.567 bytes')).toEqual(['1,500', '1.234.567']);
    expect(numbers('Temperature -5°C, offset -12.5ms')).toEqual(['-5', '-12.5']);
  });

  it('ignores digits within words, versions and addresses', () => {
    expect(numbers('host01 and host-01 run v1.2 and node_2')).toEqual([]);
    expect(numbers('Version 1.2.3 on 10.0.0.1')).toEqual([]);
  });

  it('ends a number before the end of a sentence', () => {
    expect(numbers('Disk usage at 95.')).toEqual(['95']);
  });

  it('returns the summary as one part without numbers', () => {
    expect(splitNumbers('Host down')).toEqual([{ text: 'Host down', number: false }]);
    expect(splitNumbers('')).toEqual([]);
  });
});
