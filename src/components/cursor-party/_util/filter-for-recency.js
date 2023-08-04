/** @typedef {import('../_types').Position} Position */

/**
 * @param {Position[]} positions
 * @param {Number} threshold in milliseconds
 * @returns {Position[]}
 */
export function filterForRecency(positions, threshold) {
  return positions.filter(
    position => Date.now() - position.timestamp < threshold,
  );
}
