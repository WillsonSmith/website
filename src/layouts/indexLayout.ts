import { TemplateResult } from 'lit';

interface Page {
  content: string;
  [key: string]: unknown;
}

export const layout = (page: Page) => {
  const { content, lang = 'en', title = 'My app', ...props } = page;
  return `
<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
    </script>
  </body>
</html>
`;
};
