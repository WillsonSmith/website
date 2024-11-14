struct PrimaryTemplate: Template {
  let title: String

  var styles: String = ""
  var scripts: String = ""

  func render(content: () -> String) async -> String {
    var styleTag = ""

    if !styles.isEmpty {
      styleTag = "<style>\(styles)</style>"
    }

    var scriptTag = ""

    if !scripts.isEmpty {
      scriptTag = "<script type=\"module\">\(scripts)</script>"
    }

    return """
    <!doctype html>
    <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>\(title)</title>
        \(styleTag)
        </head>
        <body>
          \(content())
          \(scriptTag)
        </body>
    </html>
    """
  }
}
