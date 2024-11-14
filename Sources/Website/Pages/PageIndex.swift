struct PageIndex: Page {
  static let template: Template = PrimaryTemplate(title: "Home")

  let title: String = "Home"

  func render() async -> String {
    await """
        <main>
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
