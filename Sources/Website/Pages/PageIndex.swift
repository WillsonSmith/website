// MARK: - PageIndex

import Foundation
import Ink
import MiscUtils

struct PageIndex: Page {
    // MARK: Lifecycle

    init() {
        do {
            let ink = MarkdownParser()
            let markdownFiles = PageIndex.getMarkdownFiles()
            let markdownFilesContent = try PageIndex.loadMarkdownFiles(files: markdownFiles)

            self.pages = try markdownFilesContent.map { file in
                let parsed = ink.parse(file)

                guard let order = Int(parsed.metadata["order"] ?? ""),
                      let title = parsed.metadata["title"] else {
                    throw ContentReadError.noTitleError
                }

                return (title, parsed.html, order)
            }.sorted { $0.order < $1.order }

        } catch {
            print("Error parsing md \(error)")
            exit(1)
        }
    }

    // MARK: Internal

    enum ContentReadError: Error {
        case readStringError
        case noTitleError
    }

    static let template: Template = PrimaryTemplate(title: "Home")

    let pages: [(title: String, html: String, order: Int)]

    // let pageContent: []
    let links = [Link(rel: "stylesheet", href: "index.css")]
    let scripts = [Script(type: "module", src: "index.js")]

    let title: String = "Home"

    var javascript: String {
        // LANG:JS
        """
        if (customElements.get('email-link') == undefined) {
            customElements.define('email-link', class extends HTMLElement {
              constructor() {
                  super();
                  const email = this.textContent?.replace('[at]', '@');
                  if (email != undefined) {
                      const link = `<a href='mailto:${email}'>${email}</a>`;
                      this.innerHTML = link;
                  }
              }
            })
        }
        """
    }

    func render() -> String {
        var blocks: [String] = []

        for (title, section, _) in pages {
            blocks.append(
                """
                <div class="block-wrapper">
                \(
                    RaisingBlock(classList: ["block"]) {
                        """
                            <h2>\(title)</h2>
                            \(section)
                        """
                    }
                )
                </div>
                """
            )
        }

        // LANG:HTML
        return """
        <svg width='0' height='0'>
          <defs>
            <clipPath id='wave-clip' clipPathUnits='objectBoundingBox'>
              <path d='M0,0.5 C0.25,0.8 0.75,0.2 1,0.5 V1 H0 Z' />
            </clipPath>
          </defs>
        </svg>
        <div class='page-body'>
            \(GlobalNavigation())
            <main class='page-body'>
                \(HomePageHeader())
                <div class='content-wrapper'>
                    <div class='wave'></div>
                    <div class='content-background'></div>
                    <div class='page-content'>
                        \(blocks.joined())
                    </div>
                </div>
            </main>
        </div>
        \(StarSheet(count: 200, additionalClasses: ["home-star-sheet"]))
        """
    }

    // MARK: Fileprivate

    fileprivate static func getMarkdownFiles() -> [URL] {
        FSUtils.listDirectoryContents(directory: FSUtils.joinWithURL(
            url: FSUtils.cwd(),
            with: "PageIndexContent"
        ))
    }

    fileprivate static func loadMarkdownFiles(files: [URL]) throws -> [String] {
        try files.compactMap { file in
            try IOUtils.readStringFromFile(at: file)
        }
    }
}
