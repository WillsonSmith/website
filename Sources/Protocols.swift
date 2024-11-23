// MARK: - HTMLFragment

protocol HTMLFragment: Sendable {
    var css: String { get }
    var javascript: String { get }
    func render() -> String
}

extension HTMLFragment {
    var css: String { "" }
    var javascript: String { "" }
}

extension HTMLFragment {
    func _render() -> String {
        Task {
            await addResources()
        }
        return render()
    }

    func addResources() async {
        guard let resourceCollector = ResourceContext.context else {
            print("No ResourceCollector found for this task")
            return
        }
        await resourceCollector.addCSS(css)
        await resourceCollector.addJS(javascript)
    }
}

// MARK: - Template

protocol Template: Sendable {
    var links: [Link] { get set }
    var scripts: [Script] { get set }
    var styles: String { get set }
    var javascript: String { get set }
    func render(content: () -> String) -> String
}

extension Template {
    func withLinks(_ links: [Link]) -> Self {
        var copy = self
        copy.links.append(contentsOf: links)
        return copy
    }

    func withScripts(_ scripts: [Script]) -> Self {
        var copy = self
        copy.scripts.append(contentsOf: scripts)
        return copy
    }

    func withStyles(_ styles: String) -> Self {
        var copy = self
        copy.styles = styles
        return copy
    }

    func withJavascript(_ scripts: String) -> Self {
        var copy = self
        copy.javascript = scripts
        return copy
    }
}

// MARK: - Link

struct Link: CustomStringConvertible {
    let rel: String
    let href: String
    let additionalAttributes: [String: String] = [:]

    var description: String {
        """
        <link rel="\(rel)" href="\(href)" \(
            additionalAttributes.map { "\($0.key)=\"\($0.value)\"" }
                .joined(separator: " ")
        )>
        """
    }
}

// MARK: - Page

protocol Page: HTMLFragment {
    init()
    static var template: Template { get }
    var links: [Link] { get }
    var scripts: [Script] { get }
}

extension Page {
    var links: [Link] { [] }
    var scripts: [Script] { [] }
}

// MARK: - Script

struct Script: CustomStringConvertible {
    let type: String
    let src: String

    var description: String {
        """
        <script type="\(type)" src="\(src)"></script>
        """
    }
}
