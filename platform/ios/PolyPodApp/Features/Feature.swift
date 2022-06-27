import SwiftUI
import PolyPodCoreSwift

typealias FeatureId = String

class Feature {
    let path: URL
    let id: FeatureId
    let name: String
    let author: String?
    let description: String?
    let primaryColor: Color?
    let thumbnailColor: Color?
    let thumbnail: URL?
    let borderColor: Color?
    private let links: [String: String]

    static func load(path: URL) -> Feature? {
        guard let manifest = readManifest(path) else {
            return nil
        }
        return Feature(path: path, manifest: manifest)
    }

    init(
        path: URL,
        name: String?,
        author: String?,
        description: String?,
        thumbnail: String?,
        thumbnailColor: String?,
        primaryColor: String?,
        links: [String: String]?,
        borderColor: String?
    ) {
        self.path = path
        let id = path.lastPathComponent
        self.id = id
        self.name = name ?? id
        self.author = author
        self.description = description
        let primaryColor = parseColor(hexValue: primaryColor)
        self.primaryColor = primaryColor
        self.thumbnailColor = parseColor(hexValue: thumbnailColor) ?? primaryColor
        self.thumbnail = findThumbnail(
            featurePath: path,
            thumbnailPath: thumbnail
        )
        self.links = links ?? [:]
        self.borderColor = parseColor(hexValue: borderColor)
    }
    
    convenience init(path: URL, manifest: FeatureManifest) {
        self.init(path: path,
                  name: manifest.name,
                  author: manifest.author,
                  description: manifest.description,
                  thumbnail: manifest.thumbnail,
                  thumbnailColor: manifest.thumbnailColor,
                  primaryColor: manifest.primaryColor,
                  links: manifest.links,
                  borderColor: manifest.borderColor
        )
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

private func readManifest(_ basePath: URL) -> FeatureManifest? {
    let manifestPath = basePath.appendingPathComponent("manifest.json")
    do {
        let contents = try String(contentsOf: manifestPath)
        return try Core.instance.parseFeatureManifest(json: contents).get()
    } catch {
        Log.error("Failed to read manifest for \(manifestPath) -> \(error.localizedDescription)")
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
    if thumbnailPath.isEmpty {
        return nil
    }
    let fullPath = featurePath.appendingPathComponent(thumbnailPath)
    if !FileManager.default.fileExists(atPath: fullPath.path) {
        Log.error("Error: Feature thumbnail at \(thumbnailPath) does not exist")
        return nil
    }
    return fullPath
}
