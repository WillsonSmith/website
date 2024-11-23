extension String.StringInterpolation {
    mutating func appendInterpolation(_ fragment: HTMLFragment) {
        Task {
            await fragment.addResources()
        }
        let rendered = fragment.render()
        appendLiteral(rendered)
    }
}
