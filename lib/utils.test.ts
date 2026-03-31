import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils - cn függvény', () => {
  it('össze kell vonnia az egyszerű osztályokat', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('kezelnie kell a feltételes osztályokat (clsx)', () => {
    expect(cn('p-4', { 'bg-blue-500': true, 'hidden': false })).toBe('p-4 bg-blue-500');
  });

  it('felül kell írnia a tailwind konfliktusokat (tailwind-merge)', () => {
    expect(cn('p-4 p-8')).toBe('p-8'); // A későbbi prep felülírja a korábbit
    expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
  });
});
