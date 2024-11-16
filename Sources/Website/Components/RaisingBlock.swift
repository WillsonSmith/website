struct RaisingBlock: HTMLFragment {
  // MARK: Lifecycle

  init(classList: [String] = [], _ content: @Sendable @escaping () -> String) {
    self.classList = classList
    self.content = content
  }

  // MARK: Internal

  let classList: [String]

  let content: @Sendable () -> String

  var css: String {
    """
    raising-block {
      --shadow-color: 220 3% 15%;
      --shadow-strength: 1%;
      --scale: 0.98;

      display: block;
      scale: var(--scale);

      transition:
        scale 250ms ease-out,
        box-shadow 300ms ease-in-out;

      &.visible {
        --scale: 1;
        box-shadow:
          0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
          0 7px 14px -5px hsl(var(--shadow-color) /
                calc(var(--shadow-strength) + 5%));
      }
    }

    """
  }

  var javascript: String {
    """
    customElements.get('raising-block')
      ? null
      : customElements.define(
        'raising-block',
        class extends HTMLElement {
          constructor() {
            super();
            this.intersectionObserver = new IntersectionObserver(
              this._handleIntersection,
              {
                threshold: [0.5],
              },
            );
            this.intersectionObserver.observe(this);
          }

          _handleIntersection = (entries) => {
            for (const entry of entries) {
              this.classList.toggle("visible", entry.isIntersecting);
            }
          };
        },
      );
    """
  }

  func render() -> String {
    """
    <raising-block class="\(classList.joined(separator: " "))">
        \(content())
    </raising-block>
    """
  }
}
