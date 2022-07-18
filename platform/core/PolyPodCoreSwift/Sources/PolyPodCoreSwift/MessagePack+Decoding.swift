import MessagePack

extension MessagePackValue {
    func getDictionary() throws -> [MessagePackValue: MessagePackValue]? {
        guard self != nil else {
            return nil
        }
        let dictionary: [MessagePackValue: MessagePackValue] = try getDictionary()
        return dictionary
    }
    
    func getDictionary() throws -> [MessagePackValue: MessagePackValue] {
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
        if let string = self.stringValue {
            return string
        } else {
            throw DecodingError.invalidValue(info: "Expected string, received \(self)")
        }
    }
    
    func getString() throws -> String {
        if let string = self.stringValue {
            return string
        } else {
            throw DecodingError.invalidValue(info: "Expected string, received \(self)")
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
    guard let dictionary = try value.getDictionary() else {
        throw DecodingError.emptyFeatureManifest
    }
    let links = try dictionary["links"]?
        .getDictionary()?.reduce(into: [String: String]()) { partialResult, keyValue in
            let key: String = try keyValue.key.getString()
            let value: String = try keyValue.value.getString()
            partialResult[key] = value
    }
    return Feature(
        path: try dictionary.get("path").getString(),
        id: try dictionary.get("id").getString(),
        name: try dictionary.get("name").getString(),
        author: try dictionary["author"]?.getString(),
        version: try dictionary["version"]?.getString(),
        description: try dictionary["description"]?.getString(),
        thumbnail: try dictionary["thumbnail"]?.getString(),
        thumbnailColor: try dictionary.get("thumbnailColor").getString(),
        primaryColor: try dictionary.get("primaryColor").getString(),
        borderColor: try dictionary.get("borderColor").getString(),
        tileTextColor: try dictionary.get("tileTextColor").getString(),
        links: links
    )
}

func mapFeatureManifest(_ value: MessagePackValue) throws -> FeatureManifest {
    guard let dictionary = try value.getDictionary() else {
        throw DecodingError.emptyFeatureManifest
    }
    let links = try dictionary["links"]?
        .getDictionary()?.reduce(into: [String: String]()) { partialResult, keyValue in
            let key: String = try keyValue.key.getString()
            let value: String = try keyValue.value.getString()
            partialResult[key] = value
    }
    return FeatureManifest(name: try dictionary["name"]?.getString(),
                           author: try dictionary["author"]?.getString(),
                           version: try dictionary["version"]?.getString(),
                           description: try dictionary["description"]?.getString(),
                           thumbnail: try dictionary["thumbnail"]?.getString(),
                           thumbnailColor: try dictionary["thumbnailColor"]?.getString(),
                           primaryColor: try dictionary["primaryColor"]?.getString(),
                           borderColor: try dictionary["borderColor"]?.getString(),
                           tileTextColor: try dictionary["tileTextColor"]?.getString(),
                           links: links)
}

extension Dictionary {
    func get(_ key: Key) throws -> Value {
        guard let value = self[key] else {
            throw  DecodingError.missingDictionaryKey(info: "\(key)")
        }
        return value
    }
}
