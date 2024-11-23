struct StarSheet: HTMLFragment {
    // MARK: Lifecycle

    init(count: Int, maximumStarSize: Int = 4, additionalClasses: [String] = []) {
        self.count = count
        self.maximumStarSize = maximumStarSize

        var tempStars: [Star] = []
        for _ in 1 ... count {
            let x = Double.random(in: 0 ... 100)
            let y = Double.random(in: 0 ... 100)
            let size = Int.random(in: 1 ... maximumStarSize)
            tempStars.append(Star(x: x, y: y, size: size))
        }

        self.stars = tempStars

        self.additionalClasses = additionalClasses
    }

    // MARK: Internal

    struct Star {
        let x: Double
        let y: Double
        let size: Int
    }

    let maximumStarSize: Int
    let count: Int

    let additionalClasses: [String]

    var css: String {
        // LANG:CSS
        """
        .component--star-sheet {
            pointer-events: none;
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;

            .circle {
                --size: 1px;
                --x: 0%;
                --y: 0%;
                --opacity: 1;

                position: absolute;
                inset: var(--y) var(--x) auto auto;

                background: #fff;
                opacity: var(--opacity);

                inline-size: var(--size);
                block-size: var(--size);
                border-radius: 50%;
            }
        }
        """
    }

    func render() -> String {
        // LANG:HTML
        """
        <div aria-hidden="true" class="component--star-sheet \(
            additionalClasses
                .joined(separator: " ")
        )">
                \(stars.map { star in
                    """
                    <div
                      class="circle"
                      style="
                          --x: \(star.x)%;
                          --y: \(star.y)%;
                          --size: \(star.size)px;
                          --opacity: \(1 - (Double(star.size) / Double(maximumStarSize + 1)));
                      "></div>
                    """
                }.joined(separator: "\n"))
        </div>
        """
    }

    // MARK: Private

    private let stars: [Star]
}
