/**
 *
 * @param {{content: string}} param0
 * @returns
 */
export const layout = ({ content }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
  <body>
    ${content}
  </body>
</html>`;
