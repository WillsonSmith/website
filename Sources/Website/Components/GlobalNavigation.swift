struct GlobalNavigation: HTMLFragment {
  let links: [String: String] = [
    "https://github.com/willsonsmith": "Github",
    "https://www.linkedin.com/in/willsonsmith/": "LinkedIn",
  ]

  var css: String {
    """
        .global-navigation {
            color: var(--gray-1);

            --font-family-title: 'Lilita One', sans-serif;
            --font-size-title: var(--font-size-5);
            --font-weight-title: var(--font-weight-3);

            position: sticky;
            top: 0;

            display: flex;
            align-items: center;

            /* background: var(--gray-2); */

            padding-block: var(--size-1);
            padding-inline: var(--size-fluid-2);

            .links {
                display: flex;
                gap: var(--size-3);
            }

            a {
                text-decoration: none;
            }

            h1 {
                flex: 1;
                font-family: var(--font-family-title);
                font-size: var(--font-size-title);
                font-weight: var(--font-weight-title);

                /* line-height: var(--font-lineheight-1); */
            }
        }
    """
  }

  func render() async -> String {
    """
        <header class="global-navigation">
            <h1>Willson Smith</h1>
            <nav class="links">
                \(links.map { link, title in
                  """
                      <a href="\(link)" target="_blank">\(title)</a>
                  """
                }.joined(separator: "\n"))
            </nav>
        </header>
    """
  }
}
