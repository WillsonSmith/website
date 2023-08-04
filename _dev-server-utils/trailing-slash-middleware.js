export async function trailingSlashMiddleware(context, next) {
  if (!context.url.includes('.') && !context.url.endsWith('/')) {
    context.redirect(`${context.url}/`);
  }
  return next();
}
