import PolyPodCore
import Foundation
import MessagePack

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
