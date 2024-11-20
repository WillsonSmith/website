struct StarSheet: HTMLFragment {
  // MARK: Lifecycle

  init(count: Int, maximumStarSize: Int = 4) {
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
  }

  // MARK: Internal

  struct Star {
    let x: Double
    let y: Double
    let size: Int
  }

  let maximumStarSize: Int
  let count: Int

  var css: String {
    """
     .component--star-sheet {
         pointer-events: none;
         position: fixed;
         width: 100%;
         height: 100%;


         .circle {
             --size: 1px;
             --x: 0%;
             --y: 0%;

             --opacity: 1;

             background: #fff;
             opacity: var(--opacity);
             position: absolute;

             inline-size: var(--size);
             block-size: var(--size);
             border-radius: 50%;

             inset: var(--y) var(--x) auto auto;
         }
     }
    """
  }

  func render() async -> String {
    """
        <div class="component--star-sheet">
                \(stars.map { star in
                  """
                  <div
                    class="circle"
                    style="
                        --x: \(star.x)%;
                        --y: \(star.y)%;
                        --size: \(star.size)px;
                        --opacity: \(Double(star.size) / Double(maximumStarSize));
                    "></div>
                  """
                }.joined(separator: "\n"))
        </div>
    """
  }

  // MARK: Private

  private let stars: [Star]
}
