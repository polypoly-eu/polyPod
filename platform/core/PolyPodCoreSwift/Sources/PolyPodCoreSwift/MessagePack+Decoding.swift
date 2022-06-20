import MessagePack

extension MessagePackValue {
    func getDictionary() throws -> [MessagePackValue: MessagePackValue]? {
        guard self != nil else {
            return nil
        }
        
        if let dictionary = self.dictionaryValue {
            return dictionary
        } else {
            throw MessagePackDecodingError.invalidValue(info: "Expected dictionary")
        }
    }
    
    func getString() throws -> String? {
        guard self != nil else {
            return nil
        }
        if let string = self.stringValue {
            return string
        } else {
            throw MessagePackDecodingError.invalidValue(info: "Expected string")
        }
    }
}

func mapError(_ dict: [MessagePackValue: MessagePackValue]) throws -> CoreFailure {
    guard let code = dict["code"]?.intValue.flatMap(CoreFailureCode.init),
          let message = dict["message"]?.stringValue else {
        throw MessagePackDecodingError.invalidCoreFailure(info: "Received \(dict)")
    }
    
    return CoreFailure(code: code, message: message)
}

func mapFeatureManifest(_ dictionary: [MessagePackValue: MessagePackValue]) throws -> FeatureManifest {
    return FeatureManifest(name: try dictionary["name"]?.getString(),
                           author: try dictionary["author"]?.getString(),
                           version: try dictionary["version"]?.getString(),
                           description: try dictionary["description"]?.getString(),
                           thumbnail: try dictionary["thumbnail"]?.getString(),
                           thumbnailColor: try dictionary["thumbnail_color"]?.getString(),
                           primaryColor: try dictionary["primary_color"]?.getString(),
                           links: try dictionary["links"]?.getDictionary() as? [String: String])
}

