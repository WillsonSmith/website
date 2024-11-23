// MARK: - PageMovies

struct PageMovies {
    let title: String

    var javascript: String {
        // LANG:JS
        """
        console.log('test')
        """
    }

    var css: String {
        // LANG:CSS
        """
        .page-movies {
            background: blue;
        }
        """
    }

    var body: String {
        // LANG:HTML
        """
        <div class='page-movies'>
          <h1>\(title)</h1>
          <p>Hello!</p>
        </div>
        """
    }

    func withResourceCollector(collector: AssetCollector) {
        Task {
            await collector.registerCSS(css)
            await collector.registerJS(javascript)
        }
    }
}

// MARK: - AssetCollector

actor AssetCollector {
    var css: Set<String> = []
    var js: Set<String> = []

    func registerCSS(_ css: String) {
        self.css.insert(css)
    }

    func registerJS(_ js: String) {
        self.js.insert(js)
    }
}
