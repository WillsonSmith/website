// MARK: - PrimaryTemplate

struct PrimaryTemplate: Template {
  static let cssReset: CSSMinifier = .init(
    """
      html {
        box-sizing: border-box;
      }

      html *,
      html *::before,
      html *::after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        font-family: var(--font-sans);
        font-weight: var(--font-weight-3);
        font-size: var(--font-size-1);
        line-height: var(--font-lineheight-1);
        letter-spacing: var(--font-letterspacing-1);
        color: hsl(var(--gray-12-hsl));
        background: hsl(var(--gray-0-hsl));
        font-synthesis: none;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-size-adjust: 100%;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        font-weight: var(--font-weight-4);
        line-height: var(--font-lineheight-3);
      }

      p {
        margin: 0;
      }

      ul[role='list'] {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      img {
        display: block;
        max-width: 100%;
      }

      figure {
        margin-block: var(--size-fluid-2);
        margin-inline: var(--size-fluid-3);
      }

      figure blockquote {
        margin-block: var(--size-fluid-1);
        margin-inline: var(--size-fluid-3);
      }

      a {
        color: inherit;
      }
    """
  )

  let title: String

  var links: [Link] = []
  var scripts: [Script] = []
  var styles: String = ""
  var javascript: String = ""

  func render(content: () -> String) async -> String {
    var styleTag = ""

    if !styles.isEmpty {
      styleTag = "<style>\(styles)</style>"
    }

    var scriptTag = ""

    if !javascript.isEmpty {
      scriptTag = "<script type=\"module\">\(javascript)</script>"
    }

    var css: String {
      """
          @import 'https://unpkg.com/open-props';
          \(PrimaryTemplate.cssReset.css)
      """
    }

    return String(
      """
      <!doctype html>
      <html>
          <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>\(title)</title>
          <style>\(css)</style>
          \(links.map { String(describing: $0) }.joined(separator: "\n"))
          \(styleTag)
          </head>
          <body>
            \(content())
            \(scriptTag)
            \(scripts.map { String(describing: $0) }.joined(separator: "\n"))
          </body>
      </html>
      """
    )
  }
}
