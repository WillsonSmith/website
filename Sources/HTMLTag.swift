// // MARK: - HTMLTagProtocol
//
// protocol HTMLTagProtocol {
//   var attributes: Set<String> { get set }
//
//   func addAttribute(key: String, value: String) -> Self
// }
//
// extension HTMLTagProtocol {
//   func addAttribute(key: String, value: String) -> Self {
//     var copy = self
//     copy.attributes.insert("\(key)=\"\(value)\"")
//     return copy
//   }
// }
//
// // MARK: - HTMLPairedTagProtocol
//
// protocol HTMLPairedTagProtocol: HTMLTagProtocol {
//   var content: @Sendable () -> any HTMLTagProtocol { get }
// }
//
// // MARK: - HTMLTag
//
// enum HTMLTag {
//   struct Paired: HTMLPairedTagProtocol {
//     // MARK: Lifecycle
//
//     init(_ tagName: String, _ content: @Sendable @escaping () -> String) {
//       self.tagName = tagName
//       self.content = content
//     }
//
//     // MARK: Internal
//
//     var attributes: Set<String> = []
//
//     let content: @Sendable () -> String
//
//     // MARK: Private
//
//     private let tagName: String
//   }
//
//   struct Unpaired: HTMLTagProtocol {
//     // MARK: Lifecycle
//
//     init(_ tagName: String) {
//       self.tagName = tagName
//     }
//
//     // MARK: Internal
//
//     var attributes: Set<String> = []
//
//     let tagName: String
//   }
// }
//
// func makeThing() -> HTMLTag.Paired {
//   HTMLTag.Paired("div") {
//     "<p>Hello!</p>"
//   }.addAttribute(key: "style", value: "display: none")
// }
