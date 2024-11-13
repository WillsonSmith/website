extension String.StringInterpolation {
  mutating func appendInterpolation(_ fragment: HTMLFragment) async {
    let rendered = await fragment._render()
    appendLiteral(rendered)
  }
}
