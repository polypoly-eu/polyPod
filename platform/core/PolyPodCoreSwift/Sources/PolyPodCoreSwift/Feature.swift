import Foundation

enum FeatureCategoryId: String {
    case yourData
    case dataKnowHow
    case tools
    case developer
}

struct FeatureCategory {
    public let id: FeatureCategoryId
    public let name: String
    public let features: [Feature]
}

struct Feature {
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
