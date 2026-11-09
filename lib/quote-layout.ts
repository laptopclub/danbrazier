// A six-line sine-wave cycle, anchored to the first line and capped at ±4.5rem.
export function quoteLineOffset(index: number, phase: number): number {
  return 2.25 * (Math.sin(phase + index * Math.PI / 3) - Math.sin(phase));
}
