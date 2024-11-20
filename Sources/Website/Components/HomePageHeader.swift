struct HomePageHeader: HTMLFragment {
  let tagName = "h-image-swap"

  var javascript: String {
    """
      customElements.get('\(tagName)') 
      ? null 
      : customElements.define('\(tagName)', class extends HTMLElement {
            images = [];

            constructor() {
                super()
                this.intersectionObserver = new IntersectionObserver(
                this.handleIntersections, {
                    rootMargin: '-80px 0px 0px 0px',
                      threshold: [0.85],
                    }
                )
                this.intersectionObserver.observe(this);
            }

            handleIntersections = (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this.setAttribute('data-visible', 2)
                    }
                }
            }



        })
    """
  }

  var css: String {
    """
    h-image-swap {
        display: grid;
        place-items: center;
        position: sticky;
        top: var(--size-3);


        .image {
            display: grid;
            grid-template-areas: "main";
            place-items: center;

            background-image: var(--gradient-9);
            max-inline-size: var(--size-12);
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
                <img src="/images/thumbs-up.png" width="420" height="420"></source>
                <img src="/images/peace.png" width="420" height="420"></source>
            </div>
        </\(tagName)>
    """
  }
}
