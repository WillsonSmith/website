/**
 *
 * @param {string[]} hydrate
 * @returns {string}
 */
export function generateHydrationScript(hydrate) {
  if (hydrate.length === 0) {
    return '';
  }
  return `
    const litHydrateSupportInstalled = await import('@lit-labs/ssr-client/lit-element-hydrate-support.js');
    ${hydrate.map(path => `import('${path}')`).join(';\n    ') || ''}
    `;
}
