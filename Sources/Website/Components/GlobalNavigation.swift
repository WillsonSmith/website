struct GlobalNavigation: HTMLFragment {
    let links: [(url: String, title: String)] = [
        ("https://github.com/willsonsmith", "Github"),
        ("https://www.linkedin.com/in/willsonsmith/", "LinkedIn"),
    ]

    var css: String {
        """
        .global-navigation {
            color: var(--gray-1);
            --font-size-title: var(--font-size-5);
            --font-weight-title: var(--font-weight-6);

            position: sticky;
            top: 0;
            z-index: 10;

            display: flex;
            align-items: center;


            padding-block: var(--size-1);
            padding-inline: var(--size-fluid-2);

            .links {
                display: flex;
                gap: var(--size-3);
            }

            a {
                text-decoration: none;
                scale: 1;
                transform-origin: 50% 100%;
                transition: scale 100ms var(--ease-out-1);

                &:hover {
                    scale: 1.1;
                }
            }

            h1 {
                flex: 1;
                font-family: var(--font-rounded-sans);
                font-size: var(--font-size-title);
                font-weight: var(--font-weight-title);

                /* line-height: var(--font-lineheight-1); */
            }
        }
        """
    }

    func render() -> String {
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
