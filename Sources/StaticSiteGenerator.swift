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
    let resourceCollector = ResourceCollector()

    await ResourceContext.$context.withValue(resourceCollector) {
      let component = Fragment(title: "Hello!")
      let result = await component._render()
      let css = await resourceCollector.css.joined(separator: "\n")
      let javascript = await resourceCollector.javascript.joined(separator: "\n")

      print(result)
      print(css)
      print(javascript)
    }
    // let component = Fragment(title: "Hello!")
    // let result = await component._render()
    // let css = await component.resourceCollector.css.joined(separator: "\n")
    // let javascript = await component.resourceCollector.javascript.joined(separator: "\n")
    //
  }
}

// MARK: - HTMLFragment

protocol HTMLFragment: Sendable {
  func _render() async -> String
}

extension String.StringInterpolation {
  mutating func appendInterpolation(_ fragment: HTMLFragment) async {
    let rendered = await fragment._render()
    appendLiteral(rendered)
  }
}

// MARK: - SubFragment

struct SubFragment: HTMLFragment {
  // MARK: Internal

  let css: String = """
      .sub-component {
          background: black;
      }
  """

  let javascript: String = """
  console.log("Sub-component")
  """

  func render() -> String {
    """
    <p>Some content</p>
    """
  }

  func _render() async -> String {
    await addAssets()
    return render()
  }

  // MARK: Private

  private func addAssets() async {
    guard let resourceCollector = ResourceContext.context else {
      print("No ResourceCollector found for this task")
      return
    }
    await resourceCollector.addCSS(css)
    await resourceCollector.addJS(javascript)
  }
}

// MARK: - Fragment

struct Fragment: HTMLFragment {
  // MARK: Internal

  let title: String

  let css: String = """
  .my-component {
      border: 1px solid black;
      border-radius: 4px;
  }
  """

  let javascript: String = """
  console.log("Test script")
  """

  func render() async -> String {
    await """
    <div class="my-component">
        <h1>\(title)</h1>
        <div class="content">
            \(SubFragment())
        </div>
    </div>
    """
  }

  func _render() async -> String {
    await addAssets()
    return await render()
  }

  // MARK: Private

  private func addAssets() async {
    guard let resourceCollector = ResourceContext.context else {
      print("No ResourceCollector found for this task")
      return
    }
    await resourceCollector.addCSS(css)
    await resourceCollector.addJS(javascript)
  }
}

// MARK: - ResourceContext

enum ResourceContext {
  @TaskLocal
  static var context: ResourceCollector?
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
