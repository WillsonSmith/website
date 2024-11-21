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
          this.classList.toggle('visible', entry.isIntersecting);
        }
      };
    },
  );
  customElements.get('h-image-swap') 
  ? null 
  : customElements.define('h-image-swap', class extends HTMLElement {
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
