struct HomePageHeader: HTMLFragment {
  let tagName = "h-image-swap"

  var javascript: String {
    """
        if (customElements.get('\(tagName)') == undefined) {
            customElements.define('\(tagName)', class extends HTMLElement {
                images = [];

                constructor() {
                    super()
                    this.intersectionObserver = new IntersectionObserver(
                    this.handleIntersections, {
                        rootMargin: '-180px 0px 0px 0px',

                          threshold: [0.25],
                        }
                    )
                    this.intersectionObserver.observe(this);
                }

                handleIntersections = (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            this.setAttribute('data-visible', 1)
                        } else {
                            this.setAttribute('data-visible', 2);
                        }
                    }
                }
            })
        }
    """
  }

  var css: String {
    """
    \(tagName) {
        display: grid;
        place-items: center;
        height: var(--size-12);
        position: sticky;
        top: 50px;


        .image {
            display: grid;
            grid-template-areas: "main";
            place-items: center;

            max-inline-size: 144px;
            border-radius: var(--radius-blob-5);
            padding: var(--size-2);
        }

        img {
            grid-area: main;
            opacity: 0;
            block-size: auto;
            max-inline-size: 100%;
            transition: opacity 500ms var(--ease-out-5);
        }

        &[data-visible="1"] img:nth-child(1) {
            opacity: 1;
        }
        &[data-visible="2"] img:nth-child(2) {
            opacity: 1;
        }
    }
    """
  }

  func render() async -> String {
    """
        <\(tagName) data-visible="1">
            <div class="image">
                <img
                    loading="lazy"
                    alt="An avatar of Willson waving at the screen."
                    src="/images/thumbs-up.png"
                    width="144"
                    height="144">
                <img
                    loading="lazy"
                    alt=""
                    src="/images/peace.png"
                    width="144"
                    height="144">
            </div>
        </\(tagName)>
    """
  }
}
