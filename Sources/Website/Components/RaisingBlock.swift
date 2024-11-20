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
      --scale: 0.98;

      display: block;
      scale: var(--scale);

      transition:
        scale 250ms var(--ease-out-1), box-shadow .3s var(--ease-1);

      &.visible {
        --scale: 1;
        box-shadow: var(--shadow-1);
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
