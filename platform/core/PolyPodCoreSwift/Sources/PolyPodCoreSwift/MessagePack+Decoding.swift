import MessagePack
import Foundation

extension MessagePackValue {
    func getDictionary() throws -> CoreResponseObject? {
        guard self != nil else {
            return nil
        }
        let dictionary: CoreResponseObject = try getDictionary()
        return dictionary
    }
    
    func getDictionary() throws -> CoreResponseObject {
        if let dictionary = self.dictionaryValue {
            return dictionary
        } else {
            throw DecodingError.invalidValue(info: "Expected dictionary, received \(self)")
        }
    }

    func getArray() throws -> [MessagePackValue] {
        if let dictionary = self.arrayValue {
            return dictionary
        } else {
            throw DecodingError.invalidValue(info: "Expected array, received \(self)")
        }
    }

    func getString() throws -> String? {
        guard self != nil else {
            return nil
        }
        let string: String = try getString()
        return string
    }
    
    func getString() throws -> String {
        if let string = self.stringValue {
            return string
        } else {
            throw DecodingError.invalidValue(info: "Expected string, received \(self)")
        }
    }

    func getBool() throws -> Bool {
        if let bool = self.boolValue {
            return bool
        } else {
            throw DecodingError.invalidValue(info: "Expected bool, received \(self)")
        }
    }
    
    func getUInt() throws -> UInt? {
        guard self != nil else {
            return nil
        }
        if let uint = self.uintValue {
            return uint
        } else {
            throw DecodingError.invalidValue(info: "Expected uint, received \(self)")
        }
    }
}

func mapError(_ dict: [MessagePackValue: MessagePackValue]) throws -> CoreFailure {
    guard let code = dict["code"]?.intValue.flatMap(CoreFailureCode.init),
          let message = dict["message"]?.stringValue else {
        throw DecodingError.invalidCoreFailure(info: "Received \(dict)")
    }
    
    return CoreFailure(code: code, message: message)
}

func mapFeatureCategories(_ value: MessagePackValue) throws -> [FeatureCategory] {
    try value.getArray().map(mapFeatureCategory)
}

func mapFeatureCategory(_ value: MessagePackValue) throws -> FeatureCategory {
    let dictionary: [MessagePackValue: MessagePackValue] = try value.getDictionary()

    return FeatureCategory(
        id: try mapFeatureCategoryId(dictionary.get("id").getString()),
        name: try dictionary.get("name").getString(),
        features: try dictionary.get("features").getArray().map(mapFeature)
    )
}

func mapFeatureCategoryId(_ value: String) throws -> FeatureCategoryId {
    guard let id = FeatureCategoryId(rawValue: value) else {
        throw DecodingError.unknownFeatureCategoryId(info: "\(value)")
    }
    return id
}

func mapFeature(_ value: MessagePackValue) throws -> Feature {
    let dictionary: CoreResponseObject = try value.getDictionary()
    
    let links = try dictionary["links"]?
        .getDictionary().reduce(into: [String: String]()) { partialResult, keyValue in
            let key: String = try keyValue.key.getString()
            let value: String = try keyValue.value.getString()
            partialResult[key] = value
    }
    return try Feature(
        path: URL(fileURLWithPath: dictionary.get("path").getString()),
        id: dictionary.get("id").getString(),
        name: dictionary.get("name").getString(),
        author: dictionary["author"]?.getString(),
        description: dictionary["description"]?.getString(),
        primaryColor: dictionary.get("primaryColor").getString(),
        thumbnailColor: dictionary.get("thumbnailColor").getString(),
        thumbnail: dictionary["thumbnail"]?
            .getString()
            .map(URL.init(fileURLWithPath:)),
        borderColor: dictionary.get("borderColor").getString(),
        tileTextColor: dictionary.get("tileTextColor").getString(),
        links: links ?? [:]
    )
}

extension Dictionary {
    func get(_ key: Key) throws -> Value {
        guard let value = self[key] else {
            throw  DecodingError.missingDictionaryKey(info: "\(key)")
        }
        return value
    }
}
