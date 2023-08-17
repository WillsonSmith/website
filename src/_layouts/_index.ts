import type { CSSResult } from 'lit';
import { generateHydrationScript } from './_utils/generate-hydration-script.js';

type Page = {
  content: string;
  lang?: string;
  title?: string;
  styles?: CSSResult;
  hydrate?: string[];
  metaTags?: { name: string; content: string }[];
  links?: { rel: string; href: string }[];
};

export const layout = ({
  content,
  lang = 'en',
  title = 'My app',
  styles,
  hydrate = [],
  metaTags = [],
  links = [],
}: Page) => {
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
