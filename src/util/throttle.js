/**
 *
 * @param {function} fn
 * @param {number} wait
 * @return {function(...any): void}
 */
export const throttle = (fn, wait) => {
  let last = 0;

  return (...args) => {
    const now = Date.now();
    if (now - last < wait) {
      return;
    }
    last = now;
    return fn(...args);
  };
};
