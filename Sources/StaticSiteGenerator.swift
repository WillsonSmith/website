// The Swift Programming Language
// https://docs.swift.org/swift-book
//
// Swift Argument Parser
// https://swiftpackageindex.com/apple/swift-argument-parser/documentation

import ArgumentParser
import MiscUtils

// MARK: - StaticSiteGenerator

@main
struct StaticSiteGenerator: AsyncParsableCommand {
  @Option(
    help: "the name of the thing"
  )
  var name: String?

  mutating func run() async {
    let pageDict: [String: Page.Type] = [
      "index.html": PageIndex.self,
      "about.html": PageAbout.self,
    ]

    for (route, pageStruct) in pageDict {
      let resourceCollector = ResourceCollector()

      await ResourceContext.$context.withValue(resourceCollector) {
        let page = await pageStruct.init()._render()
        let css = await resourceCollector.css.joined(separator: "\n")
        let javascript = await resourceCollector.javascript.joined(separator: "\n")

        let template = pageStruct.template.withScripts(javascript).withStyles(css)
        let renderedContent = await template.render { page }

        do {
          let output = FSUtils.joinWithURL(url: FSUtils.cwd(), with: "web/\(route)")
          try IOUtils.writeStringToFile(
            renderedContent,
            toURL: output
          )

        } catch {
          print("Problem rendering page for: \(route)")
        }
      }
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
