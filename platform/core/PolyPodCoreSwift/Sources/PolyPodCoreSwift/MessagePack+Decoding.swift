import MessagePack

extension MessagePackValue {
    func getDictionary() throws -> [MessagePackValue: MessagePackValue]? {
        guard self != nil else {
            return nil
        }
        
        if let dictionary = self.dictionaryValue {
            return dictionary
        } else {
            throw DecodingError.invalidValue(info: "Expected dictionary, received \(self)")
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

