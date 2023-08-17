import { throttle } from '../../../util/throttle.js';

import type { Position } from '../_types.js';

function cursorIsShakingFn(recentMovements: Position[]): boolean {
  const [first, ...rest] = recentMovements;

  let [xMax, xMin, yMax, yMin] = [first.x, first.x, first.y, first.y];
  for (const position of rest) {
    if (position.y < yMin) {
      yMin = position.y;
    }
    if (position.y > yMax) {
      yMax = position.y;
    }
    if (position.x < xMin) {
      xMin = position.x;
    }
    if (position.x > xMax) {
      xMax = position.x;
    }
  }

  if (first.y > yMin && first.y < yMax && yMax - yMin > 50) {
    return true;
  }

  if (first.x > xMin && first.x < xMax && xMax - xMin > 50) {
    return true;
  }

  return false;
}

export const cursorIsShaking = throttle(cursorIsShakingFn, 100);
