// A six-line sine-wave cycle, anchored to the first line and capped at ±1.5rem.
export function quoteLineOffset(index: number, phase: number): number {
  return 0.75 * (Math.sin(phase + index * Math.PI / 3) - Math.sin(phase));
}
