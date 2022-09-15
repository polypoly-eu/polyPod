import Foundation
import MessagePack

final public class MessagePackDecoder {
    public init() {}
    public var userInfo: [CodingUserInfoKey : Any] = [:]
    
    public func decode<T>(_ type: T.Type, from value: MessagePackValue) throws -> T where T : Decodable {
        let decoder = _MessagePackDecoder(value: value)
        decoder.userInfo = self.userInfo
        
//        switch type {
//        case is Data.Type:
//            let box = try Box<Data>(from: decoder)
//            return box.value as! T
//        case is Date.Type:
//            let box = try Box<Date>(from: decoder)
//            return box.value as! T
//        default:
//            return try T(from: decoder)
//        }
        
        return try T(from: decoder)
    }
}

final class _MessagePackDecoder {
    var codingPath: [CodingKey] = []
    var userInfo: [CodingUserInfoKey : Any] = [:]
    
    var container: MessagePackDecodingContainer?
    fileprivate var value: MessagePackValue
    
    init(value: MessagePackValue) {
        self.value = value
    }
}

protocol MessagePackDecodingContainer: AnyObject {
    var codingPath: [CodingKey] { get set }
    var userInfo: [CodingUserInfoKey : Any] { get }
    var value: MessagePackValue { get set }
}

extension _MessagePackDecoder: Decoder {
    fileprivate func assertCanCreateContainer() {
        precondition(self.container == nil)
    }
        
    func container<Key>(keyedBy type: Key.Type) -> KeyedDecodingContainer<Key> where Key : CodingKey {
        assertCanCreateContainer()

        let container = KeyedContainer<Key>(value: self.value, codingPath: self.codingPath, userInfo: self.userInfo)
        self.container = container

        return KeyedDecodingContainer(container)
    }

    func unkeyedContainer() -> UnkeyedDecodingContainer {
        assertCanCreateContainer()
        
        let container = UnkeyedContainer(value: self.value, codingPath: self.codingPath, userInfo: self.userInfo)
        self.container = container

        return container
    }
    
    func singleValueContainer() -> SingleValueDecodingContainer {
        assertCanCreateContainer()
        
        let container = SingleValueContainer(value: self.value, codingPath: self.codingPath, userInfo: self.userInfo)
        self.container = container
        
        return container
    }
}

extension _MessagePackDecoder {
    final class KeyedContainer<Key> where Key: CodingKey {
        lazy var nestedContainers: [String: MessagePackDecodingContainer] = {
            guard let count = self.count else {
                return [:]
            }
            
            var nestedContainers: [String: MessagePackDecodingContainer] = [:]
            
            let unkeyedContainer = UnkeyedContainer(data: self.data.suffix(from: self.index), codingPath: self.codingPath, userInfo: self.userInfo)
            unkeyedContainer.count = count * 2
            
            do {
                var iterator = unkeyedContainer.nestedContainers.makeIterator()

                for _ in 0..<count {
                    guard let keyContainer = iterator.next() as? _MessagePackDecoder.SingleValueContainer,
                        let container = iterator.next() else {
                        fatalError() // FIXME
                    }
                    
                    let key = try keyContainer.decode(String.self)
                    container.codingPath += [AnyCodingKey(stringValue: key)!]
                    nestedContainers[key] = container
                }
            } catch {
                fatalError("\(error)") // FIXME
            }
            
            self.index = unkeyedContainer.index
            
            return nestedContainers
        }()
        
        lazy var count: Int? = {
            do {
                let format = try self.readByte()
                switch format {
                case 0x80...0x8f:
                    return Int(format & 0x0F)
                case 0xde:
                    return Int(try read(UInt16.self))
                case 0xdf:
                    return Int(try read(UInt32.self))
                default:
                    return nil
                }
            } catch {
                return nil
            }
        }()

        var value: MessagePackValue
        var codingPath: [CodingKey]
        var userInfo: [CodingUserInfoKey: Any]

        func nestedCodingPath(forKey key: CodingKey) -> [CodingKey] {
            return self.codingPath + [key]
        }
        
        init(value: MessagePackValue, codingPath: [CodingKey], userInfo: [CodingUserInfoKey : Any]) {
            self.codingPath = codingPath
            self.userInfo = userInfo
            self.value = value
        }
        
        func checkCanDecodeValue(forKey key: Key) throws {
            guard self.contains(key) else {
                let context = DecodingError.Context(codingPath: self.codingPath, debugDescription: "key not found: \(key)")
                throw DecodingError.keyNotFound(key, context)
            }
        }
    }
}

extension _MessagePackDecoder.KeyedContainer: KeyedDecodingContainerProtocol {
    var allKeys: [Key] {
        return self.nestedContainers.keys.map{ Key(stringValue: $0)! }
    }
    
    func contains(_ key: Key) -> Bool {
        return self.nestedContainers.keys.contains(key.stringValue)
    }
    
    func decodeNil(forKey key: Key) throws -> Bool {
        try checkCanDecodeValue(forKey: key)

        let nestedContainer = self.nestedContainers[key.stringValue]

        switch nestedContainer {
        case let singleValueContainer as _MessagePackDecoder.SingleValueContainer:
            return singleValueContainer.decodeNil()
        case is _MessagePackDecoder.UnkeyedContainer,
             is _MessagePackDecoder.KeyedContainer<AnyCodingKey>:
            return false
        default:
            let context = DecodingError.Context(codingPath: self.codingPath, debugDescription: "cannot decode nil for key: \(key)")
            throw DecodingError.typeMismatch(Any?.self, context)
        }
    }
    
    func decode<T>(_ type: T.Type, forKey key: Key) throws -> T where T : Decodable {
        try checkCanDecodeValue(forKey: key)
        
        let container = self.nestedContainers[key.stringValue]!
        let decoder = MessagePackDecoder()
        let value = try decoder.decode(T.self, from: container.data)
        
        return value
    }
    
    func nestedUnkeyedContainer(forKey key: Key) throws -> UnkeyedDecodingContainer {
        try checkCanDecodeValue(forKey: key)
        
        guard let unkeyedContainer = self.nestedContainers[key.stringValue] as? _MessagePackDecoder.UnkeyedContainer else {
            throw DecodingError.dataCorruptedError(forKey: key, in: self, debugDescription: "cannot decode nested container for key: \(key)")
        }
        
        return unkeyedContainer
    }
    
    func nestedContainer<NestedKey>(keyedBy type: NestedKey.Type, forKey key: Key) throws -> KeyedDecodingContainer<NestedKey> where NestedKey : CodingKey {
        try checkCanDecodeValue(forKey: key)
        
        guard let keyedContainer = self.nestedContainers[key.stringValue] as? _MessagePackDecoder.KeyedContainer<NestedKey> else {
            throw DecodingError.dataCorruptedError(forKey: key, in: self, debugDescription: "cannot decode nested container for key: \(key)")
        }
        
        return KeyedDecodingContainer(keyedContainer)
    }
    
    func superDecoder() throws -> Decoder {
        return _MessagePackDecoder(data: self.data)
    }
    
    func superDecoder(forKey key: Key) throws -> Decoder {
        let decoder = _MessagePackDecoder(data: self.data)
        decoder.codingPath = [key]
        
        return decoder
    }
}

extension _MessagePackDecoder.KeyedContainer: MessagePackDecodingContainer {}

extension _MessagePackDecoder {
    final class SingleValueContainer {
        var codingPath: [CodingKey]
        var userInfo: [CodingUserInfoKey: Any]
        var value: MessagePackValue

        init(value: MessagePackValue, codingPath: [CodingKey], userInfo: [CodingUserInfoKey : Any]) {
            self.codingPath = codingPath
            self.userInfo = userInfo
            self.value = value
        }
    }
}

extension _MessagePackDecoder.SingleValueContainer: SingleValueDecodingContainer {
    func decodeNil() -> Bool {
        return self.value.isNil
    }
    
    func decode(_ type: Bool.Type) throws -> Bool {
        return try self.value.getBool()
    }
    
    func decode(_ type: String.Type) throws -> String {
        return try self.value.getString()
    }
    
    func decode(_ type: Int.Type) throws -> Int {
        return try self.value.getInt()
    }
    
    func decode(_ type: Int8.Type) throws -> Int8 {
        return try self.value.getInt8()
    }
    
    func decode(_ type: Int16.Type) throws -> Int16 {
        return try self.value.getInt16()
    }
    
    func decode(_ type: Int32.Type) throws -> Int32 {
        return try self.value.getInt32()
    }
    
    func decode(_ type: Int64.Type) throws -> Int64 {
        return try self.value.getInt64()
    }
    
    func decode(_ type: UInt.Type) throws -> UInt {
        return try self.value.getUInt()
    }
    
    func decode(_ type: UInt8.Type) throws -> UInt8 {
        return try self.value.getUInt8()
    }
    
    func decode(_ type: UInt16.Type) throws -> UInt16 {
        return try self.value.getUInt16()
    }
    
    func decode(_ type: UInt32.Type) throws -> UInt32 {
        return try self.value.getUInt32()
    }
    
    func decode(_ type: UInt64.Type) throws -> UInt64 {
        return try self.value.getUInt64()
    }
    
    func decode(_ type: Double.Type) throws -> Double {
        return try self.value.getDouble()
    }
    
    func decode(_ type: Float.Type) throws -> Float {
        return try self.value.getFloat()
    }
    
    func decode(_ type: Date.Type) throws -> Date {
        guard let dateString = self.value.stringValue,
              let date = ISO8601DateFormatter().date(from: dateString) else {
            throw DecodingError.invalidValue(info: "Could not decode \(self.value) as date")
        }
        return date
    }
    
    func decode(_ type: Data.Type) throws -> Data {
        return try self.value.getData()
    }
    
    func decode<T>(_ type: T.Type) throws -> T where T : Decodable {
        switch type {
        case is Data.Type:
            return try decode(Data.self) as! T
        case is Date.Type:
            return try decode(Date.self) as! T
        default:
            let decoder = _MessagePackDecoder(value: self.value)
            return try T(from: decoder)
        }
    }
}

extension _MessagePackDecoder.SingleValueContainer: MessagePackDecodingContainer {}

extension _MessagePackDecoder {
    final class UnkeyedContainer {
        var codingPath: [CodingKey]
        
        var nestedCodingPath: [CodingKey] {
            return self.codingPath + [AnyCodingKey(intValue: self.count ?? 0)!]
        }

        var userInfo: [CodingUserInfoKey: Any]
        var value: MessagePackValue
        var currentIndex: Int = 0
        
        lazy var nestedContainers: [MessagePackDecodingContainer] = {
            guard let count = self.count else {
                return []
            }

            var nestedContainers: [MessagePackDecodingContainer] = []

            do {
                for _ in 0..<count {
                    let container = try self.decodeContainer()
                    nestedContainers.append(container)
                }
            } catch {
                fatalError("\(error)") // FIXME
            }

            self.currentIndex = 0

            return nestedContainers
        }()
        
        init(value: MessagePackValue, codingPath: [CodingKey], userInfo: [CodingUserInfoKey : Any]) {
            self.codingPath = codingPath
            self.userInfo = userInfo
            self.value = value
        }
    }
}

extension _MessagePackDecoder.UnkeyedContainer: UnkeyedDecodingContainer {
    var count: Int? {
        if let array = self.value.arrayValue {
            return array.count
        }
        return nil
    }
    
    var isAtEnd: Bool {
        guard let count = self.count else {
            return true
        }
        
        return currentIndex >= count
    }
    
    func decodeNil() throws -> Bool {
        defer { self.currentIndex += 1 }

        let nestedContainer = self.nestedContainers[self.currentIndex]

        switch nestedContainer {
        case let singleValueContainer as _MessagePackDecoder.SingleValueContainer:
            return singleValueContainer.decodeNil()
        case is _MessagePackDecoder.UnkeyedContainer,
             is _MessagePackDecoder.KeyedContainer<AnyCodingKey>:
            return false
        default:
            throw DecodingError.invalidValue(info: "Cannot decode nil for \(self.value) at index \(self.currentIndex)")
        }
    }
    
    func decode<T>(_ type: T.Type) throws -> T where T : Decodable {
        defer { self.currentIndex += 1 }

        let container = self.nestedContainers[self.currentIndex]
        let decoder = MessagePackDecoder()
        let value = try decoder.decode(T.self, from: container.value)

        return value
    }
    
    func nestedUnkeyedContainer() throws -> UnkeyedDecodingContainer {
        defer { self.currentIndex += 1 }
        let container = self.nestedContainers[self.currentIndex] as! _MessagePackDecoder.UnkeyedContainer
        return container
    }

    func nestedContainer<NestedKey>(keyedBy type: NestedKey.Type) throws -> KeyedDecodingContainer<NestedKey> where NestedKey : CodingKey {
        defer { self.currentIndex += 1 }
        let container = self.nestedContainers[self.currentIndex] as! _MessagePackDecoder.KeyedContainer<NestedKey>
        return KeyedDecodingContainer(container)
    }

    func superDecoder() throws -> Decoder {
        return _MessagePackDecoder(value: self.value)
    }
}

extension _MessagePackDecoder.UnkeyedContainer {
    func decodeContainer() throws -> MessagePackDecodingContainer {
        defer { self.currentIndex += 1 }
        
        guard let array = self.value.arrayValue else {
            throw DecodingError.invalidValue(info: "Could not get array value from \(self.value).")
        }
        
        guard currentIndex < array.count else {
            throw DecodingError.invalidValue(info: "UnkeyedContainer: currentIndex < array.count")
        }
        
        let current = array[currentIndex]
        
        if let _ = current.arrayValue {
            return _MessagePackDecoder.UnkeyedContainer(value: current, codingPath: self.nestedCodingPath, userInfo: self.userInfo)
        } else if let _ = current.dictionaryValue {
            return _MessagePackDecoder.KeyedContainer<AnyCodingKey>(value: current, codingPath: self.nestedCodingPath, userInfo: self.userInfo)
        } else {
            return _MessagePackDecoder.SingleValueContainer(value: current, codingPath: self.codingPath, userInfo: self.userInfo)
        }
    }
}

extension _MessagePackDecoder.UnkeyedContainer: MessagePackDecodingContainer {}

struct AnyCodingKey: CodingKey, Equatable {
    var stringValue: String
    var intValue: Int?
    
    init?(stringValue: String) {
        self.stringValue = stringValue
        self.intValue = nil
    }
    
    init?(intValue: Int) {
        self.stringValue = "\(intValue)"
        self.intValue = intValue
    }
    
    init<Key>(_ base: Key) where Key : CodingKey {
        if let intValue = base.intValue {
            self.init(intValue: intValue)!
        } else {
            self.init(stringValue: base.stringValue)!
        }
    }
}

extension AnyCodingKey: Hashable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(self.stringValue)
    }
}
