// MARK: - PrimaryTemplate

struct PrimaryTemplate: Template {
  static let cssReset: CSSMinifier = .init(
    """

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

    return String(
      """
      <!doctype html>
      <html>
          <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>\(title)</title>
          <link rel="stylesheet" href="/styles/reset.css">
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
