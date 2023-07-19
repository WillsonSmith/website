/**
 *
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (fn, wait) => {
  /** @type { ReturnType<typeof setTimeout> } */
  let timeout;

  /**
   * @param  {...any} args
   */
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};
