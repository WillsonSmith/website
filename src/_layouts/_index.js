import { generateHydrationScript } from './_utils/generate-hydration-script.js';

/**
 * @typedef Page
 * @prop {string} content
 * @prop {string} [lang="en"]
 * @prop {string} [title="My app"]
 * @prop {import('lit').CSSResult} [styles]
 * @prop {string[]} [hydrate=[]]
 * @prop {{name: String, content: String}[]} [metaTags=[]]
 * @prop {{rel: String, href: String}[]} [links=[]]
 *

/**
 *
 * @param {Page} page
 * @returns {string}
 */
export const layout = ({
  content,
  lang = 'en',
  title = 'My app',
  styles,
  hydrate = [],
  metaTags = [],
  links = [],
}) => {
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
      .map(
        ({ name, content: metaTagContent }) =>
          `<meta name="${name}" content="${metaTagContent}">`,
      )
      .join('\n')}
    <link rel="icon" type="image/png" href="/public/favicon.png">
    <link rel="stylesheet" href="/src/css/main.css">
    ${links
      .map(({ rel, href }) => `<link rel="${rel}" href="${href}">`)
      .join('\n')}
    ${styleTag}
  </head>
  <body>
    ${content}

    <script type="module">
    const HPrototype = HTMLTemplateElement.prototype;
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
