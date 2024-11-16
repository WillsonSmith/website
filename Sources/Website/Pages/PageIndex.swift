struct PageIndex: Page {
  static let template: Template = PrimaryTemplate(title: "Home")

  let title: String = "Home"

  var css: String {
    """
        .block {
            background: #fff;
            border: 1px solid #efefef;
            border-radius: 4px;
            padding-block: calc(1rem / 4); 
            padding-inline: calc(1rem);
        }
    """
  }

  func render() async -> String {
    await """
        <main>
            <h1>\(title)</h1>
            \(RaisingBlock(classList: ["block"]) {
              """
              <p>Hello!</p>
              """
            })
        </main>
    """
  }
}
