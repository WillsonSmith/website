// MARK: - HTMLFragment

protocol HTMLFragment: Sendable {
  var css: String { get }
  var javascript: String { get }
  func render() async -> String
}

extension HTMLFragment {
  var css: String { "" }
  var javascript: String { "" }
}

extension HTMLFragment {
  func _render() async -> String {
    await addResources()
    return await render()
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
  var styles: String { get set }
  var scripts: String { get set }
  func render(content: () -> String) async -> String
}

extension Template {
  func withStyles(_ styles: String) -> Self {
    var copy = self
    copy.styles = styles
    return copy
  }

  func withScripts(_ scripts: String) -> Self {
    var copy = self
    copy.scripts = scripts
    return copy
  }
}

// MARK: - Page

protocol Page: HTMLFragment {
  static var template: Template { get }
}
