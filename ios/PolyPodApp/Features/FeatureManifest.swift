import Foundation

struct FeatureManifest: Decodable {
    let name: String?
    let author: String?
    let description: String?
    let thumbnail: String?
    let primaryColor: String?
    let links: [String: String]?
    let translations: [String: Override]?
    
    static func load(path: URL) -> FeatureManifest? {
        guard let contents = try? String(contentsOf: path) else {
            return nil
        }
        guard let data = contents.data(using: .utf8) else {
            return nil
        }
        guard let manifest = try? JSONDecoder().decode(FeatureManifest.self, from: data) else {
            return nil
        }
        return manifest
    }
    
    struct Override: Decodable {
        var name: String? = nil
        var author: String? = nil
        var description: String? = nil
        var thumbnail: String? = nil
        var primaryColor: String? = nil
        var links: [String: String]? = nil
    }
}
