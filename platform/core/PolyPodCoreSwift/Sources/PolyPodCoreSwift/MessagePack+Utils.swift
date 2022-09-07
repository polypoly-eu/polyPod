import MessagePack
import Foundation

// MARK: - Value extraction
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
    
    func getInt() throws -> Int {
        if let int = self.intValue {
            return int
        } else {
            throw DecodingError.invalidValue(info: "Expected int, received \(self)")
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

extension Dictionary {
    func get(_ key: Key) throws -> Value {
        guard let value = self[key] else {
            throw  DecodingError.missingDictionaryKey(info: "\(key)")
        }
        return value
    }
}


// MARK: - Encoding

extension Encodable {
    func pack() -> Data {
        let encoded = try! MessagePackEncoder.encode(self)
        return MessagePack.pack(encoded)
    }
}

public protocol MessagePackDecodable {
    init(from value: MessagePackValue) throws
}

extension MessagePackValue: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = value
    }
}

extension Array: MessagePackDecodable where Element: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = try value.getArray().map(Element.init(from:))
    }
}

extension Bool: MessagePackDecodable {
    public init(from value: MessagePackValue) throws {
        self = try value.getBool()
    }
}

extension Result: Encodable where Success: Encodable, Failure: Encodable {
    
    private enum CodingKeys: String, CodingKey {
        case success = "Ok"
        case failure = "Err"
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: Result.CodingKeys.self)
        switch self {
        case .success(let value):
            try container.encode(value, forKey: .success)
        case .failure(let error):
            try container.encode(error, forKey: .failure)
        }
    }
}
