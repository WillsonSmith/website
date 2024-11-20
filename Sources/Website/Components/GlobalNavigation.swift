struct GlobalNavigation: HTMLFragment {
  let links: [String: String] = [
    "https://github.com/willsonsmith": "Github",
    "https://www.linkedin.com/in/willsonsmith/": "LinkedIn",
  ]

  var css: String {
    """
        .global-navigation {
            --font-family-title: 'Lilita One', sans-serif;
            --font-size-title: var(--font-size-5);
            --font-weight-title: var(--font-weight-3);

            display: flex;
            align-items: center;
            position: sticky;
            top: 0;
            padding-block: var(--size-fluid-1);
            padding-inline: var(--size-fluid-3);

            h1 {
                flex: 1;
                font-family: var(--font-family-title);
                font-size: var(--font-size-title);
                font-weight: var(--font-weight-title);
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
