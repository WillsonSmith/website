if (customElements.get('h-image-swap') == undefined) {
    customElements.define('h-image-swap', class extends HTMLElement {
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

if (customElements.get('email-link') == undefined) {
    customElements.define('email-link', class extends HTMLElement {
      constructor() {
          super();
          const email = this.textContent?.replace('[at]', '@');
          if (email != undefined) {
              const link = `<a href="mailto:${email}">${email}</a>`;
              this.innerHTML = link;
          }
      }
    })
}