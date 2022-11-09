import Foundation
import MessagePack

public enum FeatureCategoryId: String, Encodable {
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

extension FeatureCategory: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        let dictionary: [MessagePackValue: MessagePackValue] = try value.getDictionary()
        self.id = try FeatureCategoryId.init(from: dictionary.get("id"))
        self.name = try dictionary.get("name").getString()
        self.features = try [Feature].init(from: dictionary.get("features"))
    }
}

extension FeatureCategoryId: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        guard let id = FeatureCategoryId(rawValue: try value.getString()) else {
            throw DecodingError.unknownFeatureCategoryId(info: "\(value)")
        }
        self = id
    }
}

extension Feature: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        let dictionary: CoreResponseObject = try value.getDictionary()
        
        let links = try dictionary["links"]?
            .getDictionary().reduce(into: [String: String]()) { partialResult, keyValue in
                let key: String = try keyValue.key.getString()
                let value: String = try keyValue.value.getString()
                partialResult[key] = value
            }
        path = try URL(fileURLWithPath: dictionary.get("path").getString())
        id = try dictionary.get("id").getString()
        name = try dictionary.get("name").getString()
        author = try dictionary["author"]?.getString()
        description = try dictionary["description"]?.getString()
        primaryColor = try dictionary.get("primaryColor").getString()
        thumbnailColor = try dictionary.get("thumbnailColor").getString()
        thumbnail = try dictionary["thumbnail"]?
            .getString()
            .map(URL.init(fileURLWithPath:))
        borderColor = try dictionary.get("borderColor").getString()
        tileTextColor = try dictionary.get("tileTextColor").getString()
        self.links = links ?? [:]
    }
}
