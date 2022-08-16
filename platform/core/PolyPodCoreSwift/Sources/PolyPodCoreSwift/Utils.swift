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
