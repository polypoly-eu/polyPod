import PolyPodCore
import Foundation
import MessagePack
import SwiftUI

func unpackBytes(bytes: CByteBuffer) throws -> MessagePackValue {
    defer {
        free_bytes(bytes.data)
    }
    
    let buffer = UnsafeBufferPointer(
        start: bytes.data,
        count: Int(bytes.length)
    )
    let data = Data(buffer: buffer)
    
    return try MessagePack.unpackFirst(data)
}

func mapToPlatformRequest(request: MessagePackValue) throws -> PlatformRequest {
    guard let result = PlatformRequest.init(rawValue: request.stringValue ?? "") else {
        throw DecodingError.invalidValue(info: "Could not convert \(request.stringValue ?? "") to PlatformRequest. ")
    }
    return result
}

func handle(platformRequest: PlatformRequest) -> PlatformResponse {
    switch platformRequest {
    case .Example:
        return PlatformResponse.Example("Test")
    }
}

func packPlatformResponse(response: Result<PlatformResponse, Error>) -> Data {
    var result: [MessagePackValue: MessagePackValue] = [:]
    switch response {
    case .success(let platformResponse):
        switch platformResponse {
        case .Example(let name):
            result["Ok"] = .map(["Example": .string(name)])
        }
    case .failure(let error):
        result["Err"] = .string(error.localizedDescription)
    }
    
    return MessagePack.pack(.map(result))
}

func packCoreRequest(request: CoreRequest) -> Data {
    return MessagePack.pack(serialize(request))
}

func serialize(_ opt: Any?) -> MessagePackValue {
    if let val = opt {
        return serialize(val)
    } else {
        return .nil
    }
}

func serialize(_ value: Any) -> MessagePackValue {
    // What is case extended(Int8, Data) for?
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
    // TODO: Handle all the other types, like CoreFailure for example
    // Maybe see if you can serialize any enum or struct ;)
    case is CoreRequest:
        let req = value as! CoreRequest
        switch req {
        case .example(let arg1, let arg2):
            return .map(["Example" : .array([serialize(arg1), serialize(arg2)])])
        }
    default:
        // Handle this a better way
        fatalError("Good luck buddy!")
    }
}

// deserialize

// Note: Nesting types need to have their own methods.
// For example
// Optional<T> is a nesting type
// Result<T, Error> is a nesting type
// It is all because the type system in Swift is not exactly the best.

func deserialize<T>(value: MessagePackValue) throws -> Optional<T> {
    if value == .nil {
        return nil
    } else {
        let deserialized: T = try deserialize(value: value)
        return deserialized
    }
}

func deserialize<T>(value: MessagePackValue) throws -> Result<T, Error> {
    switch value {
    case .map(let val):
        if let okay = val[.string("Ok")] {
            return Result.success(try deserialize(value: okay))
        } else if let err = val[.string("Err")] {
            return Result.failure(try deserialize(value: err))
        } else {
            throw DecodingError.invalidValue(info: "Expected Result<\(T.self), Error>, received \(value)")
        }
    default:
        throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
    }
}

func deserialize(value: MessagePackValue) throws -> CoreResponse {
    switch value {
    case .map(let val):
        if let example = val[.string("Example")] {
            let result: Result<Optional<String>, CoreFailure> = try deserialize(value: example)
            return CoreResponse.example(result)
        } else {
            throw DecodingError.invalidValue(info: "Expected CoreResponse case, received \(value)")
        }
    default:
        throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
    }
}

// Example of CoreFailure from core
// map([string(code): uint(10), string(message): string(File system failed for path 'path' with error: 'message')]
func deserialize(value: MessagePackValue) throws -> CoreFailure {
    switch value {
    case .map(let val):
        guard let codeVal = val["code"],
              let messageVal = val["message"] else {
            throw DecodingError.invalidValue(info: "Expected code and message, received \(val)")
        }
        
        let code: UInt = try deserialize(value: codeVal)
        let message: String = try deserialize(value: messageVal)
        
        guard let codeCase = CoreFailureCode(rawValue: Int(code)) else {
            throw DecodingError.invalidValue(info: "No error found for code: \(code), received \(val)")
        }
        
        return CoreFailure(code: codeCase, message: message)
    default:
        throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
    }
}

func deserialize<T>(value: MessagePackValue) throws -> T {
    switch value {
    case .nil:
        throw DecodingError.invalidValue(info: "Expected \(T.self), received Optional")
    case .bool(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .int(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .uint(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .float(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .double(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .string(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .binary(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .array(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .map(let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    case .extended(_, let val):
        if T.self != type(of: val) {
            throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
        }
        return val as! T
    }
}

extension Data {
    var toByteBuffer: CByteBuffer {
        let ptr = UnsafeMutablePointer<UInt8>.allocate(capacity: count)
        withUnsafeBytes { (buff) -> Void in
            ptr.initialize(from: buff.bindMemory(to: UInt8.self).baseAddress!, count: count)
        }
        return CByteBuffer(length: UInt32(count), data: ptr)
    }
}

extension Dictionary {
    func transform<K: Hashable, V>(keyTransform: (Key) -> K, valueTransform: (Value) -> V) -> Dictionary<K, V> {
        var new = [K: V]()
        self.forEach { key, value in
            new[keyTransform(key)] = valueTransform(value)
        }
        return new
    }
}
