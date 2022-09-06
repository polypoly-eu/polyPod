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
        guard let uint = self.uintValue else {
            throw DecodingError.invalidValue(info: "Expected uint, received \(self)")
        }
        return uint
    }
}

func mapError(_ dict: [MessagePackValue: MessagePackValue]) throws -> CoreFailure {
    guard let code = dict["code"]?.intValue.flatMap(CoreFailureCode.init),
          let message = dict["message"]?.stringValue else {
        throw DecodingError.invalidCoreFailure(info: "Received \(dict)")
    }
    
    return CoreFailure(code: code, message: message)
}

public protocol MessagePackDecodable {
    init(from value: MessagePackValue) throws
}

extension MessagePackValue: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = value
    }
}

extension UserSessionTimeoutOption: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        guard let option = UserSessionTimeoutOption(rawValue: try value.getString()) else {
            throw DecodingError
                .unknownUserSessionTimeoutOption(info: "Received msgPackValue \(value)")
        }
        self = option
    }
}

extension UserSessionTimeoutOptionConfig: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        let object: CoreResponseObject = try value.getDictionary()
        self.option = try UserSessionTimeoutOption(from: object.get("option"))
        self.duration = try object.get("duration").getUInt()
    }
}

extension Array: MessagePackDecodable where Element: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = try value.getArray().map(Element.init(from:))
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

extension Bool: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = try value.getBool()
    }
}

extension Dictionary {
    func get(_ key: Key) throws -> Value {
        guard let value = self[key] else {
            throw  DecodingError.missingDictionaryKey(info: "\(key)")
        }
        return value
    }
}
