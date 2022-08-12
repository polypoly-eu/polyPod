import PolyPodCore
import Foundation
import MessagePack

// Note: You need a different deserialize functions for each generic type
// If you say T, T does not stand for a generic type like Optional or Result or Array or Dict
// All of those need their own deserialize functions

// TODO: Add arrays and dict functions with Optional and NonOptional Types

func deserializeOpt<T>(value: MessagePackValue) throws -> Optional<T> {
    if value == .nil {
        return nil
    } else {
        let deserialized: T = try deserialize(value: value)
        return deserialized
    }
}

func deserializeResult<T>(value: MessagePackValue) throws -> Result<T, Error> {
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

func deserializeResultWithCoreFailure<T>(value: MessagePackValue) throws -> Result<T, CoreFailure> {
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


func deserializeResultWithOptional<T>(value: MessagePackValue) throws -> Result<T?, Error> {
    switch value {
    case .map(let val):
        if let okay = val[.string("Ok")] {
            return Result.success(try deserializeOpt(value: okay))
        } else if let err = val[.string("Err")] {
            return Result.failure(try deserialize(value: err))
        } else {
            throw DecodingError.invalidValue(info: "Expected Result<\(T.self), Error>, received \(value)")
        }
    default:
        throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
    }
}

func deserializeResultWithOptionalAndCoreFailure<T>(value: MessagePackValue) throws -> Result<T?, CoreFailure> {
    switch value {
    case .map(let val):
        if let okay = val[.string("Ok")] {
            return Result.success(try deserializeOpt(value: okay))
        } else if let err = val[.string("Err")] {
            return Result.failure(try deserialize(value: err))
        } else {
            throw DecodingError.invalidValue(info: "Expected Result<\(T.self), Error>, received \(value)")
        }
    default:
        throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
    }
}

// Example of CoreFailure from core
// map([string(code): uint(10), string(message): string(File system failed for path 'path' with error: 'message')]

// T is not a generic type
func deserialize<T>(value: MessagePackValue) throws -> T {
    if T.self == CoreResponse.self {
        switch value {
        case .map(let val):
            if let example = val[.string("Example")] {
                let result: Result<Optional<String>, CoreFailure> = try deserializeResultWithOptionalAndCoreFailure(value: example)
                return CoreResponse.example(result) as! T
            } else {
                throw DecodingError.invalidValue(info: "Expected CoreResponse case, received \(value)")
            }
        default:
            throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
        }
    } else if T.self == CoreFailure.self {
        switch value {
        case .map(let val):
            guard let codeVal = val["code"],
                  let messageVal = val["message"] else {
                throw DecodingError.invalidValue(info: "Expected code and message, received \(val)")
            }
            
            let code: UInt64 = try deserialize(value: codeVal)
            let message: String = try deserialize(value: messageVal)
            
            guard let codeCase = CoreFailureCode(rawValue: Int(code)) else {
                throw DecodingError.invalidValue(info: "No error found for code: \(code), received \(val)")
            }
            
            return CoreFailure(code: codeCase, message: message) as! T
        default:
            throw DecodingError.invalidValue(info: "Expected .map, received \(value)")
        }
    } else {
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
            // T needs to be UInt64
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
            throw DecodingError.invalidValue(info: "Array deserialization missing or you have called deserialize instead of deserializeArray.")
//            return val.map { v in
//                return try! deserialize(value: v) as Any
//            } as! T
        case .map(let val):
            // This should always fail because maps are generic types in swift
            throw DecodingError.invalidValue(info: "Dict deserialization missing or you have called deserialize instead of deserializeDict.")
        case .extended(_, let val):
            if T.self != type(of: val) {
                throw DecodingError.invalidValue(info: "Expected \(T.self), received \(type(of: val))")
            }
            return val as! T
        }
    }
}

/*
 if T.self == CoreResponse.self {
     
 } else if T.self == Result<Any, Error>.self {
     
 }
 */
