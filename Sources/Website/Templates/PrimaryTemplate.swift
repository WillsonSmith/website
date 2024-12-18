// MARK: - PrimaryTemplate

struct PrimaryTemplate: Template {
    let title: String

    var links: [Link] = []
    var scripts: [Script] = []
    var styles: String = ""
    var javascript: String = ""

    func render(content: () -> String) -> String {
        var styleTag = ""

        if !styles.isEmpty {
            styleTag = "<style>\(styles)</style>"
        }

        var scriptTag = ""

        if !javascript.isEmpty {
            scriptTag = "<script type=\"module\">\(javascript)</script>"
        }

        // LANG:HTML
        return """
        <!doctype html>
        <html lang="en">
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="Willson Smith is a software developer with a specialization in user experience and front-end development from Toronto, Canada.">
            <title>\(title)</title>
            <link rel="icon" type="image/png" href="/public/favicon.png">
            <link rel="stylesheet" href="/styles/reset.css">
            \(links.map { String(describing: $0) }.joined(separator: "\n"))
            \(styleTag)
            </head>
            <body>
              <!-- All code is intentionally unminified so that others can learn. -->
              \(content())
              \(scriptTag)
              \(scripts.map { String(describing: $0) }.joined(separator: "\n"))
            </body>
        </html>
        """
    }
}
