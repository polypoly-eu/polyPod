import PolyPodCore
import Foundation
import MessagePack

func unpackBytes(bytes: CByteBuffer) -> Result<MessagePackValue, CoreFailure> {
    defer {
        free_bytes(bytes.data)
    }
    
    do {
        let buffer = UnsafeBufferPointer(
            start: bytes.data,
            count: Int(bytes.length)
        )
        let data = Data(buffer: buffer)

        return .success(try MessagePack.unpackFirst(data))
    } catch {
        return .failure(CoreFailure.init(code: .FailedToExtractBytes, message: error.localizedDescription))
    }
}

func mapToPlatformRequest(request: MessagePackValue) -> Result<PlatformRequest, CoreFailure> {
    guard let result = PlatformRequest.init(rawValue: request.stringValue ?? "") else {
        let decodingError = DecodingError.invalidValue(info: "Could not convert \(request.stringValue ?? "") to PlatformRequest. ")
        return .failure(CoreFailure.init(code: .FailedToDecode, message: decodingError.localizedDescription))
    }
    return .success(result)
}

func handle(platformRequest: PlatformRequest) -> PlatformResponse {
    switch platformRequest {
    case .Example:
        return PlatformResponse.Example("Test")
    }
}

func packPlatformResponse(response: Result<PlatformResponse, CoreFailure>) -> Data {
    let response = try! MessagePackEncoder().encode(response)
    return MessagePack.pack(response)
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

extension Result: Encodable where Success : Encodable, Failure : Encodable {
    
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
