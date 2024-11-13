struct CustomParagraph: HTMLFragment {
  let content: @Sendable () -> String

  var css: String {
    """
    .custom-paragraph {
        font-family: sans-serif;
    }

    floating-card {
        box-shadow: 0 0 3px 0 rgb(from #efefef r g b / 0.5);
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
                console.log("init")

                this.style.display = "block"
                this.style.border = "1px solid black"
                this.style.borderRadius = "4px"
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
