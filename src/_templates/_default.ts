export const template =
  (markup: string) =>
  ({ title }: { title: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body>
    ${markup}
  </body>
</html>
  `;
