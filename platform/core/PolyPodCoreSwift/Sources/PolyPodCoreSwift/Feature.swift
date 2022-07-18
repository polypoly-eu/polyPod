import Foundation

public enum FeatureCategoryId: String {
    case yourData
    case knowHow
    case tools
    case developer
}

public struct FeatureCategory {
    public let id: FeatureCategoryId
    public let name: String
    public let features: [Feature]
}

public struct Feature {
    public init(
        path: URL,
        id: String,
        name: String,
        author: String?,
        description: String?,
        primaryColor: String,
        thumbnailColor: String,
        thumbnail: URL?,
        borderColor: String,
        tileTextColor: String,
        links: [String : String]
    ) {
        self.path = path
        self.id = id
        self.name = name
        self.author = author
        self.description = description
        self.primaryColor = primaryColor
        self.thumbnailColor = thumbnailColor
        self.thumbnail = thumbnail
        self.borderColor = borderColor
        self.tileTextColor = tileTextColor
        self.links = links
    }
    
    public let path: URL
    public let id: String
    public let name: String
    public let author: String?
    public let description: String?
    public let primaryColor: String
    public let thumbnailColor: String
    public let thumbnail: URL?
    public let borderColor: String
    public let tileTextColor: String
    public let links: [String: String]
}
extension Feature {
    public func findUrl(target: String) -> String? {
        if let url = links[target] {
            return url
        }
        if links.values.contains(target) {
            return target
        }
        return nil
    }
}
