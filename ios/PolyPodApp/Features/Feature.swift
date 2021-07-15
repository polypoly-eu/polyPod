import SwiftUI

class Feature {
    let path: URL
    let name: String
    let author: String?
    let description: String?
    let primaryColor: Color?
    let thumbnail: URL?
    private let links: [String: String]
    
    static func load(path: URL, languageCode: String?) -> Feature? {
        let manifestPath = path.appendingPathComponent("manifest.json")
        guard let manifest = FeatureManifest.load(path: manifestPath) else {
            print("Failed to load feature manifest from: \(manifestPath)")
            return nil
        }
        return Feature(
            path: path,
            manifest: manifest,
            languageCode: languageCode
        )
    }
    
    init(path: URL, manifest: FeatureManifest, languageCode: String?) {
        self.path = path
        let userLanguage = languageCode ?? "en"
        let translations = manifest.translations?[userLanguage]
        name = translations?.name ?? manifest.name ?? path.lastPathComponent
        author = translations?.author ?? manifest.author
        description = translations?.description ?? manifest.description
        primaryColor = parseColor(hexValue: translations?.primaryColor ?? manifest.primaryColor)
        thumbnail = findThumbnail(
            featurePath: path,
            thumbnailPath: translations?.thumbnail ?? manifest.thumbnail
        )
        links = translations?.links ?? manifest.links ?? [:]
    }
    
    func findUrl(target: String) -> String? {
        if let url = links[target] {
            return url
        }
        if links.values.contains(target) {
            return target
        }
        return nil
    }
}

private func parseColor(hexValue: String?) -> Color? {
    guard let hexValue = hexValue else {
        return nil
    }
    return Color(fromHex: hexValue)
}

private func findThumbnail(featurePath: URL, thumbnailPath: String?) -> URL? {
    guard let thumbnailPath = thumbnailPath else {
        return nil
    }
    let fullPath = featurePath.appendingPathComponent(thumbnailPath)
    if !FileManager.default.fileExists(atPath: fullPath.path) {
        print("Error: Feature thumbnail at \(thumbnailPath) does not exist")
        return nil
    }
    return fullPath
}
