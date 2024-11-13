// The Swift Programming Language
// https://docs.swift.org/swift-book
//
// Swift Argument Parser
// https://swiftpackageindex.com/apple/swift-argument-parser/documentation

import ArgumentParser

// MARK: - StaticSiteGenerator

@main
struct StaticSiteGenerator: AsyncParsableCommand {
  @Option(
    help: "the name of the thing"
  )
  var name: String?

  mutating func run() async {
    print("Hello, \(name ?? "Anonymous")")
    let component = Fragment(title: "Hello!")
    let result = await component._render()
    let css = await component.resourceCollector.css.joined(separator: "\n")
    let javascript = await component.resourceCollector.javascript.joined(separator: "\n")

    print(result)
    print(css)
    print(javascript)
  }
}

// MARK: - Fragment

struct Fragment: Sendable {
  // MARK: Internal

  let title: String

  var resourceCollector = ResourceCollector()

  let css: String = """
  .my-component {
      border: 1px solid black;
      border-radius: 4px;
  }
  """

  let javascript: String = """
  console.log("Test script")
  """

  func render() -> String {
    """
    <div class="my-component">
        <h1>\(title)</h1>
    </div>
    """
  }

  func _render() async -> String {
    await addAssets()
    return render()
  }

  // MARK: Private

  private func addAssets() async {
    await resourceCollector.addCSS(css)
    await resourceCollector.addJS(javascript)
  }
}

// MARK: - ResourceCollector

actor ResourceCollector {
  // MARK: Lifecycle

  init() {
    self.css = []
    self.javascript = []
  }

  // MARK: Internal

  var css: Set<String>
  var javascript: Set<String>

  func addCSS(_ styles: String) {
    css.insert(styles)
  }

  func addJS(_ script: String) {
    javascript.insert(script)
  }
}
