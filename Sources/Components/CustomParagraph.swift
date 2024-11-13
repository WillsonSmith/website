struct CustomParagraph: HTMLFragment {
  let content: @Sendable () -> String

  var css: String {
    """
    .custom-paragraph {
        font-family: sans-serif;
    }
    """
  }

  var javascript: String {
    """
    customElements.get("floating-card") 
    ? null 
    : customElements.define(
        'floating-card', 
        class extends HTMLElement {
            constructor() {
                super()
                print("Init")
            }
        })
    """
  }

  func render() async -> String {
    """
    <floating-card>
    <p class="custom-paragraph">
      \(content()) 
    </p>
    </floating-card>
    """
  }
}