import PolyPodCore
import Foundation
import MessagePack
import UIKit

func unpackBytes(bytes: CByteBuffer) -> Result<MessagePackValue, CoreFailure> {
    defer {
        free_bytes(bytes.data)
    }

    return Result {
        let buffer = UnsafeBufferPointer(
            start: bytes.data,
            count: Int(bytes.length)
        )
        let data = Data(buffer: buffer)

        return try MessagePack.unpackFirst(data)
    }.mapError { error in
        CoreFailure.init(code: .failedToExtractBytes, message: error.localizedDescription)
    }
}

func mapToPlatformRequest(request: MessagePackValue) -> Result<PlatformRequest, CoreFailure> {
    guard let result = PlatformRequest.init(rawValue: request.stringValue ?? "") else {
        let decodingError = DecodingError.invalidValue(info: "Could not convert \(request.stringValue ?? "") to PlatformRequest. ")
        return .failure(CoreFailure.init(code: .failedToDecode, message: decodingError.localizedDescription))
    }
    return .success(result)
}

func handle(platformRequest: PlatformRequest) -> PlatformResponse {
    switch platformRequest {
    case .example:
        return PlatformResponse.example(name: "Test")
    }
}

extension Encodable {
    func pack() -> Data {
        let encoded = try! MessagePackEncoder.encode(self)
        return MessagePack.pack(encoded)
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
