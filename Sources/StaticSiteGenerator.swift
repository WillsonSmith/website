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
    for (route, pageStruct) in WebsiteSettings.routes {
      let resourceCollector = ResourceCollector()

      await ResourceContext.$context.withValue(resourceCollector) {
        let page = pageStruct.init()
        let pageContent = await page._render()

        let css = await resourceCollector.cssString
        let javascript = await resourceCollector.javascriptString

        var template = pageStruct.template

        do {
          if !javascript.isEmpty {
            let output = FSUtils.joinWithURL(
              url: FSUtils.cwd(),
              with: "\(WebsiteSettings.outDir)/\(route.replacingOccurrences(of: ".html", with: "-extracted.js"))"
            )

            try IOUtils.writeStringToFile(
              javascript,
              toURL: output
            )

            template = template.withScripts([Script(
              type: "module",
              src: route.replacingOccurrences(of: ".html", with: "-extracted.js")
            )])
          }

          if !css.isEmpty {
            let output = FSUtils.joinWithURL(
              url: FSUtils.cwd(),
              with: "\(WebsiteSettings.outDir)/\(route.replacingOccurrences(of: ".html", with: "-extracted.css"))"
            )
            try IOUtils.writeStringToFile(
              css,
              toURL: output
            )

            template = template.withLinks([Link(
              rel: "stylesheet",
              href: route.replacingOccurrences(of: ".html", with: "-extracted.css")
            )])
          }
        } catch {
          print("Error \(error)")
        }

        template = template
          .withLinks(page.links)
          .withScripts(page.scripts)

        let renderedContent = await template.render { pageContent }

        do {
          let output = FSUtils.joinWithURL(
            url: FSUtils.cwd(),
            with: "\(WebsiteSettings.outDir)/\(route)"
          )
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

  var cssString: String { css.joined(separator: "\n") }
  var javascriptString: String { javascript.joined(separator: "\n") }

  func addCSS(_ styles: String) {
    css.insert(styles)
  }

  func addJS(_ script: String) {
    javascript.insert(script)
  }
}
