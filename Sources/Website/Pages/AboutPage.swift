struct PageAbout: Page {
  static let template: Template = PrimaryTemplate(title: "About")

  let title: String = "About me"

  var css: String {
    """
    .about-heading {
        margin: 0;
    }
    """
  }

  func render() async -> String {
    await """
        <main class="about-heading">
            <h1>\(title)</h1>
            \(CustomParagraph {
              """
              This is some content for a paragraph.
              """
            })
        </main>
    """
  }
}
