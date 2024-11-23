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
        // LANG:CSS
        """
        raising-block {
          --scale: 0.98;

          display: block;

          scale: var(--scale);
          opacity: 1;

          transition:
            scale 250ms var(--ease-out-1), opacity 200ms var(--ease-1);

          &.ready {
            opacity: 0.6;
          }

          &.visible {
            --scale: 1;
            box-shadow: var(--shadow-1);
            opacity: 1;
          }
        }
        """
    }

    var javascript: String {
        // LANG:JS
        """
        if (customElements.get('raising-block') == undefined) {
            customElements.define('raising-block', class extends HTMLElement {
                constructor() {
                    super();
                    this.classList.add('ready');
                    this.intersectionObserver = new IntersectionObserver(
                        this.handleIntersection,
                        { threshold: [0.5] },
                    );

                    this.intersectionObserver.observe(this);
                }

                handleIntersection = (entries) => {
                    for (const entry of entries) {
                        this.classList.toggle('visible', entry.isIntersecting);
                    }
                } 
            })
        }
        """
    }

    func render() -> String {
        // LANG:HTML
        """
        <raising-block class="\(classList.joined(separator: " "))">
            \(content())
        </raising-block>
        """
    }
}
