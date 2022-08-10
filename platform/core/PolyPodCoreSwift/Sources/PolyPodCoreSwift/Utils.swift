import PolyPodCore
import Foundation
import MessagePack

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

// How do I make it detect the type automatically. I don't want to say, here make a map every time, here make a string, etc

// Test: [Optional]
// Test: Optional
// Test: ["Key": Optional]
// Test: Result<Optional, Error>

func mpValue(_ opt: Optional<Any>) -> MessagePackValue {
    if let val = opt {
        return .map([.string("Some") : mpValue(val)])
    } else {
        return .map([.string("None") : .string("")])
    }
}

func mpValue(_ value: Any) -> MessagePackValue {
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
            return mpValue(child)
        }))
    case is Dictionary<AnyHashable, Any>:
        let dict = value as! Dictionary<AnyHashable, Any>
        return .map(dict.transform(keyTransform: { mpValue($0) }, valueTransform: { mpValue($0) }))
    case is Error:
        let err = value as! Error
        return .string(err.localizedDescription)
    case is Result<Any, Error>:
        let result = value as! Result<Any, Error>
        switch result {
        case .success(let resValue):
            return .map([.string("Ok"): mpValue(resValue)])
        case .failure(let err):
            return .map([.string("Err"): mpValue(err)])
        }
    default:
        fatalError("Good luck buddy!")
    }
}

func mpValue(req: CoreRequest) -> MessagePackValue {
    switch req {
    case .example(let arg1, let arg2):
        return .map([.string("Example") : .array([mpValue(arg1), mpValue(arg2)])])
    }
}

func packCoreRequest(request: CoreRequest) -> Data {
    return MessagePack.pack(mpValue(request))
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
