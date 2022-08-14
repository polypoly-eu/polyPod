import PolyPodCore
import Foundation
import MessagePack

public class MessagePackEncoder  {
    public func encode<T>(_ value: T) throws -> MessagePackValue where T : Encodable {
        let encoder = _MessagePackEncoder()
        try value.encode(to: encoder)
        return encoder.value
    }
}

protocol MessagePackEncodingContainer {
    var value: MessagePackValue { get }
}

class SingleValueContainer: SingleValueEncodingContainer {
    var codingPath: [CodingKey]
    var userInfo: [CodingUserInfoKey: Any]
    
    init(codingPath: [CodingKey],
         userInfo: [CodingUserInfoKey : Any]) {
        self.codingPath = codingPath
        self.userInfo = userInfo
    }
    
    private var storage: MessagePackValue = MessagePackValue()
    fileprivate var canEncodeNewValue = true
    
    fileprivate func checkCanEncode(value: Any?) throws {
        guard self.canEncodeNewValue else {
            let context = EncodingError.Context(
                codingPath: self.codingPath,
                debugDescription: "Cannot encode multiple values")
            throw EncodingError.invalidValue(value as Any, context)
        }
    }
    
    func encodeNil() throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .nil
    }
    
    func _encodeOptional<T>(_ value: T?) throws {
        if T.self == Data?.self {
            guard let value = value as? Data else {
                storage = .nil
                return
            }
            storage = .binary(value)
        } else if T.self == Bool?.self {
            guard let value = value as? Bool else {
                storage = .nil
                return
            }
            storage = .bool(value)
        } else if T.self == String?.self {
            guard let value = value as? String else {
                storage = .nil
                return
            }
            storage = .string(value)
        } else if T.self == Double?.self {
            guard let value = value as? Double else {
                storage = .nil
                return
            }
            storage = .double(value)
        } else if T.self == Float?.self {
            guard let value = value as? Float else {
                storage = .nil
                return
            }
            storage = .float(value)
        } else if T.self == Int?.self {
            guard let value = value as? Int else {
                storage = .nil
                return
            }
            storage = .int(Int64(value))
        } else if T.self == Int8?.self {
            guard let value = value as? Int8 else {
                storage = .nil
                return
            }
            storage = .int(Int64(value))
        } else if T.self == Int16?.self {
            guard let value = value as? Int16 else {
                storage = .nil
                return
            }
            storage = .int(Int64(value))
        } else if T.self == Int32?.self {
            guard let value = value as? Int32 else {
                storage = .nil
                return
            }
            storage = .int(Int64(value))
        } else if T.self == Int64?.self {
            guard let value = value as? Int64 else {
                storage = .nil
                return
            }
            storage = .int(value)
        } else if T.self == UInt?.self {
            guard let value = value as? UInt else {
                storage = .nil
                return
            }
            storage = .uint(UInt64(value))
        } else if T.self == UInt8?.self {
            guard let value = value as? UInt8 else {
                storage = .nil
                return
            }
            storage = .uint(UInt64(value))
        } else if T.self == UInt16?.self {
            guard let value = value as? UInt16 else {
                storage = .nil
                return
            }
            storage = .uint(UInt64(value))
        } else if T.self == UInt32?.self {
            guard let value = value as? UInt32 else {
                storage = .nil
                return
            }
            storage = .uint(UInt64(value))
        } else if T.self == UInt64?.self {
            guard let value = value as? UInt64 else {
                storage = .nil
                return
            }
            storage = .uint(value)
        } else {
            let context = EncodingError.Context(
                codingPath: self.codingPath,
                debugDescription: "Cannot encode type \(T.self)")
            throw EncodingError.invalidValue(value as Any, context)
        }
    }
    
    func _encode<T>(_ value: T)  throws {
        // An array can arrive here. WTF?
        if T.self == Data.self {
            storage = .binary(value as! Data)
        } else if T.self == Bool.self {
            storage = .bool(value as! Bool)
        } else if T.self == String.self {
            storage = .string(value as! String)
        } else if T.self == Double.self {
            storage = .double(value as! Double)
        } else if T.self == Float.self {
            storage = .float(value as! Float)
        } else if T.self == Int.self {
            storage = .int(Int64(value as! Int))
        } else if T.self == Int8.self {
            storage = .int(Int64(value as! Int8))
        } else if T.self == Int16.self {
            storage = .int(Int64(value as! Int16))
        } else if T.self == Int32.self {
            storage = .int(Int64(value as! Int32))
        } else if T.self == Int64.self {
            storage = .int(value as! Int64)
        } else if T.self == UInt.self {
            storage = .uint(UInt64(value as! UInt))
        } else if T.self == UInt8.self {
            storage = .uint(UInt64(value as! UInt8))
        } else if T.self == UInt16.self {
            storage = .uint(UInt64(value as! UInt16))
        } else if T.self == UInt32.self {
            storage = .uint(UInt64(value as! UInt32))
        } else if T.self == UInt64.self {
            storage = .uint(value as! UInt64)
        } else {
            let context = EncodingError.Context(
                codingPath: self.codingPath,
                debugDescription: "Cannot encode type \(T.self)")
            throw EncodingError.invalidValue(value as Any, context)
        }
    }
    
    
    func encode<T>(_ value: T) throws where T : Encodable {
        try checkCanEncode(value: value)
        defer { self.canEncodeNewValue = false }
        
        if _isOptional(T.self) {
            try _encodeOptional(value)
        } else {
            try _encode(value)
        }
    }
}

extension SingleValueContainer: MessagePackEncodingContainer {
    var value: MessagePackValue {
        return self.storage
    }
}

class UnkeyedContainer: UnkeyedEncodingContainer {
    var codingPath: [CodingKey]
    var userInfo: [CodingUserInfoKey: Any]
    
    init(codingPath: [CodingKey],
         userInfo: [CodingUserInfoKey : Any]) {
        self.codingPath = codingPath
        self.userInfo = userInfo
    }
    
    struct Index: CodingKey {
        var intValue: Int?

        var stringValue: String {
            return "\(self.intValue!)"
        }

        init?(intValue: Int) {
            self.intValue = intValue
        }

        init?(stringValue: String) {
            return nil
        }
    }
    
    var storage: [MessagePackEncodingContainer] = []
    var count: Int {
        return storage.count
    }

    private var nestedCodingPath: [CodingKey] {
        return self.codingPath + [Index(intValue: self.count)!]
    }
    
    func nestedUnkeyedContainer() -> UnkeyedEncodingContainer {
        let container = UnkeyedContainer(
            codingPath: self.nestedCodingPath,
            userInfo: self.userInfo
        )
        self.storage.append(container)
        return container
    }
    
    func nestedContainer<NestedKey>(keyedBy keyType: NestedKey.Type) -> KeyedEncodingContainer<NestedKey>
    where NestedKey : CodingKey
    {
        let container = KeyedContainer<NestedKey>(
            codingPath: self.nestedCodingPath,
            userInfo: self.userInfo
        )
        self.storage.append(container)
        return KeyedEncodingContainer(container)
    }
    
    func nestedSingleValueContainer() -> SingleValueEncodingContainer
    {
        let container = SingleValueContainer(
            codingPath: self.nestedCodingPath,
            userInfo: self.userInfo
        )
        self.storage.append(container)
        return container
    }
    
    func encode<T>(_ value: T) throws where T : Encodable {
        var container = self.nestedSingleValueContainer()
        try container.encode(value)
    }
    
    func encodeNil() throws {
        var container = self.nestedSingleValueContainer()
        try container.encodeNil()
    }
    
    func superEncoder() -> Encoder {
        _MessagePackEncoder(codingPath: codingPath, userInfo: userInfo)
    }
}

extension UnkeyedContainer: MessagePackEncodingContainer {
    var value: MessagePackValue {
        var array: [MessagePackValue] = []
        for container in self.storage {
            array.append(container.value)
        }
        return .array(array)
    }
}

class KeyedContainer<Key>: KeyedEncodingContainerProtocol where Key: CodingKey {
    var codingPath: [CodingKey]
    var userInfo: [CodingUserInfoKey: Any]
    
    init(codingPath: [CodingKey],
         userInfo: [CodingUserInfoKey : Any]) {
        self.codingPath = codingPath
        self.userInfo = userInfo
    }
    
    var storage: [String: MessagePackEncodingContainer] = [:]
    
    private func nestedCodingPath(forKey key: CodingKey) -> [CodingKey] {
        return self.codingPath + [key]
    }
    
    func nestedUnkeyedContainer(forKey key: Key) -> UnkeyedEncodingContainer {
        let container = UnkeyedContainer(
            codingPath: self.nestedCodingPath(forKey: key),
            userInfo: self.userInfo
        )
        self.storage[key.stringValue] = container
        return container
    }
    
    func nestedContainer<NestedKey>(
        keyedBy keyType: NestedKey.Type,
        forKey key: Key
    ) -> KeyedEncodingContainer<NestedKey> where NestedKey : CodingKey {
        let container = KeyedContainer<NestedKey>(
            codingPath: self.nestedCodingPath(forKey: key),
            userInfo: self.userInfo
        )
        self.storage[key.stringValue] = container
        return KeyedEncodingContainer(container)
    }
    
    private func nestedSingleValueContainer(forKey key: Key) -> SingleValueEncodingContainer {
        let container = SingleValueContainer(
            codingPath: self.nestedCodingPath(forKey: key),
            userInfo: self.userInfo
        )
        self.storage[key.stringValue] = container
        return container
    }
    
    func encode<T>(_ value: T, forKey key: Key) throws where T : Encodable {
        var container = self.nestedSingleValueContainer(forKey: key)
        try container.encode(value)
    }
    
    func encodeNil(forKey key: Key) throws {
        var container = self.nestedSingleValueContainer(forKey: key)
        try container.encodeNil()
    }
    
    func superEncoder() -> Encoder {
        _MessagePackEncoder(codingPath: codingPath, userInfo: userInfo)
    }
    
    func superEncoder(forKey key: Key) -> Encoder {
        _MessagePackEncoder(codingPath: nestedCodingPath(forKey: key), userInfo: userInfo)
    }
}

extension KeyedContainer: MessagePackEncodingContainer {
    var value: MessagePackValue {
        let map = self.storage.transform(keyTransform: { MessagePackValue.string($0) },
                                         valueTransform: { $0.value })
        return .map(map)
    }
}

class _MessagePackEncoder: Encoder {
    
    var codingPath: [CodingKey]
    var userInfo: [CodingUserInfoKey : Any]
    
    init(codingPath: [CodingKey]? = nil, userInfo: [CodingUserInfoKey : Any]? = nil) {
        self.codingPath = codingPath ?? []
        self.userInfo = userInfo ?? [:]
    }
    
    fileprivate var container: MessagePackEncodingContainer? {
        willSet {
            precondition(self.container == nil)
        }
    }
    
    var value: MessagePackValue {
        return container?.value ?? .nil
    }

    func container<Key>(keyedBy type: Key.Type) -> KeyedEncodingContainer<Key> where Key : CodingKey {
        let container = KeyedContainer<Key>(
            codingPath: self.codingPath,
            userInfo: self.userInfo
        )
        self.container = container
        return KeyedEncodingContainer(container)
    }

    func unkeyedContainer() -> UnkeyedEncodingContainer {
        let container = UnkeyedContainer(
            codingPath: self.codingPath,
            userInfo: self.userInfo
        )
        self.container = container
        return container
    }

    func singleValueContainer() -> SingleValueEncodingContainer {
        let container = SingleValueContainer(
            codingPath: self.codingPath,
            userInfo: self.userInfo
        )
        self.container = container
        return container
    }
    
}
