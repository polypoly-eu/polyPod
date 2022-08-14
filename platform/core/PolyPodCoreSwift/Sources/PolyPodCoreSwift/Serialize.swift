import PolyPodCore
import Foundation
import MessagePack

public class MessagePackEncoder  {
    public func encode<T>(_ value: T) throws -> MessagePackValue
    where T : Encodable {
        // TODO
        return .nil
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
    
    func encode(_ value: Bool) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .bool(value)
    }
    
    func encode(_ value: String) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .string(value)
    }
    
    func encode(_ value: Double) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .double(value)
    }
    
    func encode(_ value: Float) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .float(value)
    }
    
    func encode(_ value: Int) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .int(Int64(value))
    }
    
    func encode(_ value: Int8) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .int(Int64(value))
    }
    
    func encode(_ value: Int16) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .int(Int64(value))
    }
    
    func encode(_ value: Int32) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .int(Int64(value))
    }
    
    func encode(_ value: Int64) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .int(value)
    }
    
    func encode(_ value: UInt) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .uint(UInt64(value))
    }
    
    func encode(_ value: UInt8) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .uint(UInt64(value))
    }
    
    func encode(_ value: UInt16) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .uint(UInt64(value))
    }
    
    func encode(_ value: UInt32) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .uint(UInt64(value))
    }
    
    func encode(_ value: UInt64) throws {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        storage = .uint(value)
    }
    
    func encode<T>(_ value: T) throws where T : Encodable {
        try checkCanEncode(value: nil)
        defer { self.canEncodeNewValue = false }
        
        if T.self == Data.self {
            let data = value as! Data
            storage = .binary(data)
        } else {
            let context = EncodingError.Context(
                codingPath: self.codingPath,
                debugDescription: "Cannot encode type \(T.self)")
            throw EncodingError.invalidValue(value as Any, context)
        }
    }
}

//class _MessagePackEncoder: Encoder {
////    class UnkeyedContainer: UnkeyedEncodingContainer
////    class KeyedContainer<Key>: KeyedEncodingContainerProtocol where Key: CodingKey
//}


func serialize(_ opt: Any?) -> MessagePackValue {
    if let val = opt {
        return serialize(val)
    } else {
        return .nil
    }
}

func serialize(_ value: Any) -> MessagePackValue {
    switch value.self {
    case is Bool:
        return .bool(value as! Bool)
    case is Int:
        return .int(Int64(value as! Int))
    case is Int8:
        return .int(Int64(value as! Int8))
    case is Int16:
        return .int(Int64(value as! Int16))
    case is Int32:
        return .int(Int64(value as! Int32))
    case is Int64:
        return .int(value as! Int64)
    case is UInt:
        return .uint(UInt64(value as! UInt))
    case is UInt8:
        return .uint(UInt64(value as! UInt8))
    case is UInt16:
        return .uint(UInt64(value as! UInt16))
    case is UInt32:
        return .uint(UInt64(value as! UInt32))
    case is UInt64:
        return .uint(value as! UInt64)
    case is String:
        return .string(value as! String)
    case is Data:
        return .binary(value as! Data)
    case is Double:
        return .double(value as! Double)
    case is Float:
        return .float(value as! Float)
    case is Array<Any>:
        return .array((value as! Array<Any>).map({ child in
            return serialize(child)
        }))
    case is Dictionary<AnyHashable, Any>:
        let dict = value as! Dictionary<AnyHashable, Any>
        return .map(dict.transform(keyTransform: { serialize($0) }, valueTransform: { serialize($0) }))
    case is Error:
        let err = value as! Error
        return .string(err.localizedDescription)
    case is Result<Any, Error>:
        let result = value as! Result<Any, Error>
        switch result {
        case .success(let resValue):
            return .map(["Ok": serialize(resValue)])
        case .failure(let err):
            return .map(["Err": serialize(err)])
        }
    case is CoreRequest:
        let req = value as! CoreRequest
        let mirror = Mirror(reflecting: req)
        print(mirror.children.count)
        for child in mirror.children {
            print("\(String(describing: child.label)) is \(child.value)")
            let childMirror = Mirror(reflecting: child.value)
            for a in childMirror.children {
                print("\(String(describing: a.label)) is \(a.value)")
            }
        }
        switch req {
        case .example(let arg1, let arg2):
            return .map(["Example" : .array([serialize(arg1), serialize(arg2)])])
        }
    // map([string(code): uint(10), string(message): string(File system failed for path 'path' with error: 'message')]
    case is CoreFailure:
        let err = value as! CoreFailure
        return .map(["code": serialize(UInt(err.code.rawValue)), "message": serialize(err.message)])
    default:
        // Handle this a better way
        fatalError("Good luck buddy!")
        
        //Maybe do a mirror here, and return a map
    }
}
