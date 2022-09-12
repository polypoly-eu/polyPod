import PolyPodCore
import Foundation
import MessagePack
import UIKit

func unpackBytes(bytes: CByteBuffer) -> Result<MessagePackValue, Error> {
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

