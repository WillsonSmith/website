enum WebsiteSettings {
  static let outDir: String = "dist"
  static let routes: [String: Page.Type] = [
    "index.html": PageIndex.self,
    "about.html": PageAbout.self,
  ]
}
