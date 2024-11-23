struct HomePageHeader: HTMLFragment {
    // MARK: Internal

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

                max-inline-size: \(imageSize)px;
                aspect-ratio: 1 / 1;
                border-radius: var(--radius-blob-5);
                padding: var(--size-2);
            }

            img {
                block-size: auto;
                max-inline-size: 100%;
            }

            picture {
                grid-area: main;
                opacity: 0;
                transition: opacity 500ms var(--ease-out-5);
            }

            &[data-visible="1"] picture:nth-child(1) {
                opacity: 1;
            }
            &[data-visible="2"] picture:nth-child(2) {
                opacity: 1;
            }
        }
        """
    }

    func render() -> String {
        """
        <\(tagName) data-visible="1">
            <div class="image">
                <picture>
                    <source srcset="/images/thumbs-up.avif" type="image/avif">
                    <img
                    loading="lazy"
                    alt="An avatar of Willson waving at the screen."
                    src="/images/thumbs-up.png"
                    width="\(imageSize)"
                    height="\(imageSize)">
                </picture>
                <picture>
                    <source srcset="/images/peace.avif" type="image/avif">
                    <img
                    loading="lazy"
                    alt=""
                    src="/images/peace.png"
                    width="\(imageSize)"
                    height="\(imageSize)">
                </picture>
            </div>
        </\(tagName)>
        """
    }

    // MARK: Private

    private let imageSize: Int = 200
}
