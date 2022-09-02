import PolyPodCore
import Foundation
import MessagePack

public class MessagePackEncoder  {
    public func encode<T>(_ value: T) throws -> MessagePackValue where T : Encodable {
        if T.self == Data.self {
            return .binary(value as! Data)
        } else if T.self == Date.self {
            return .string(ISO8601DateFormatter().string(from: value as! Date))
        }
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
    
    func encode<T>(_ value: T) throws where T : Encodable {
        try checkCanEncode(value: value)
        defer { self.canEncodeNewValue = false }
        
        switch value {
        case let val as Bool:
            storage = .bool(val)
        case let val as String:
            storage = .string(val)
        case let val as Double:
            storage = .double(val)
        case let val as Float:
            storage = .float(val)
        case let val as Int:
            storage = .int(Int64(val))
        case let val as Int8:
            storage = .int(Int64(val))
        case let val as Int16:
            storage = .int(Int64(val))
        case let val as Int32:
            storage = .int(Int64(val))
        case let val as Int64:
            storage = .int(val)
        case let val as UInt:
            storage = .uint(UInt64(val))
        case let val as UInt8:
            storage = .uint(UInt64(val))
        case let val as UInt16:
            storage = .uint(UInt64(val))
        case let val as UInt32:
            storage = .uint(UInt64(val))
        case let val as UInt64:
            storage = .uint(val)
        default:
            let encoder = MessagePackEncoder()
            storage = try encoder.encode(value)
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
