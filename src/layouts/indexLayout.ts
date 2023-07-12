interface Page {
  content: string;
  hydrate: string[];
  [key: string]: unknown;
}

export const layout = (page: Page) => {
  const { content, lang = 'en', title = 'My app', hydrate = [] } = page;
  return `
<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/public/css/props.css">
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

function generateHydrationScript(hydrate: string[]) {
  if (hydrate.length === 0) {
    return '';
  }
  return `
    const litHydrateSupportInstalled = await import('@lit-labs/ssr-client/lit-element-hydrate-support.js');
    ${hydrate.map((path: string) => `import('${path}')`).join(';\n    ') || ''}
    `;
}
