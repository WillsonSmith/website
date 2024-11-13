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
      let page = await PageOne.template.render {
        PageOne()
      }

      print(page)

      // let component = PageOneSection(title: "Hello!")
      // let result = await component._render()
      let css = await resourceCollector.css.joined(separator: "\n")
      let javascript = await resourceCollector.javascript.joined(separator: "\n")

      print(css)
      print(javascript)
    }
  }
}

// MARK: - HTMLFragment

protocol HTMLFragment: Sendable {
  var css: String { get }
  var javascript: String { get }
  func render() async -> String
}

extension HTMLFragment {
  var css: String { "" }
  var javascript: String { "" }
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

extension String.StringInterpolation {
  mutating func appendInterpolation(_ fragment: HTMLFragment) async {
    let rendered = await fragment._render()
    appendLiteral(rendered)
  }
}

// MARK: - Template

protocol Template: Sendable {
  func render(content: () -> HTMLFragment) async -> String
}

// MARK: - Page

protocol Page: Sendable {
  static var template: Template { get }
}

// MARK: - PageTemplate

struct PageTemplate: Template {
  let title: String

  func render(content: () -> HTMLFragment) async -> String {
    await """
        <!doctype html>
        <html>
        <head>
            <title>\(title)</title>
        </head>
        <body>
            \(content())
        </body>
        </html>
    """
  }
}

// MARK: - PageOne

struct PageOne: HTMLFragment, Page {
  static let template: Template = PageTemplate(title: "Home")

  func render() async -> String {
    await """
        \(PageOneSection(title: "Hello, world!"))
    """
  }
}

// MARK: - PageOneSection

struct PageOneSection: HTMLFragment {
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
            \(PageOneParagraph())
        </div>
    </div>
    """
  }
}

// MARK: - PageOneParagraph

struct PageOneParagraph: HTMLFragment {
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
