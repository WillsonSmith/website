/**
 * @typedef Page
 * @prop {string} content
 * @prop {string} lang
 * @prop {string} title
 * @prop {import('lit').CSSResult} styles
 * @prop {string[]} hydrate
 * @prop {{name: String, content: String}[]} metaTags
 */

/**
 *
 * @param {Page} page
 * @returns {string}
 */
export const layout = (page) => {
  const {
    content,
    lang = 'en',
    title = 'My app',
    styles,
    hydrate = [],
    metaTags = [],
  } = page;
  const css = styles?.cssText;
  const styleTag = css ? `<style>${css}</style>` : '';

  return `
<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${metaTags
      .map(({ name, content }) => {
        return `<meta name="${name}" content="${content}">`;
      })
      .join('\n')}
    <link rel="stylesheet" href="/public/css/main.css">
    ${styleTag}
  </head>
  <body>
    ${content}

    <script type="module">
    const HPrototype = HTMLElement.prototype;
    const shadowRoots = HPrototype.hasOwnProperty('shadowRoot') || HPrototype.hasOwnProperty('shadowRootMode');
    if (!shadowRoots) {
      const { hydrateShadowRoots } = await import(
        '@webcomponents/template-shadowroot/template-shadowroot.js'
      );
      hydrateShadowRoots(document.body);
    }
    ${generateHydrationScript(hydrate)}
    </script>
  </body>
</html>
`;
};

/**
 *
 * @param {string[]} hydrate
 * @returns
 */
function generateHydrationScript(hydrate) {
  if (hydrate.length === 0) {
    return '';
  }
  return `
    const litHydrateSupportInstalled = await import('@lit-labs/ssr-client/lit-element-hydrate-support.js');
    ${hydrate.map((path) => `import('${path}')`).join(';\n    ') || ''}
    `;
}
