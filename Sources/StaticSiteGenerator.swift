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
      let page = await PageIndex().render()

      let css = await resourceCollector.css.joined(separator: "\n")
      let javascript = await resourceCollector.javascript.joined(separator: "\n")

      print(css, javascript)

      let template = PageIndex.template.withStyles(css).withScripts(javascript)

      let renderedContent = await template.render {
        page
      }

      print(renderedContent)
    }
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
