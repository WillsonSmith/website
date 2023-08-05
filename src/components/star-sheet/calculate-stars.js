/**
 * @typedef {Object} Star
 * @property {number} x
 * @property {number} y
 * @property {number} size
 */

/**
 *
 * @param {number} width
 * @param {number} height
 * @returns {Star[]}
 */
export function calculateStars(width, height) {
  const starCount = Math.floor((width * height) / 10000);
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    size: Math.floor(Math.random() * 3),
    opacity: Math.random(),
  }));
  return stars;
}
