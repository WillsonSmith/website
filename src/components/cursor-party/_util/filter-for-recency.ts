import type { Position } from '../_types';

export function filterForRecency(
  positions: Position[],
  threshold: number,
): Position[] {
  return positions.filter(
    position => Date.now() - position.timestamp < threshold,
  );
}
