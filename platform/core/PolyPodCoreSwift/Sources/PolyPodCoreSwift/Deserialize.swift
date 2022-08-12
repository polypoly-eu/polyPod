import PolyPodCore
import Foundation
import MessagePack

// Example of CoreFailure from core
// map([string(code): uint(10), string(message): string(File system failed for path 'path' with error: 'message')]

func deserialize<T>(value: MessagePackValue) throws -> T {
    return try deserialize(
        value: value,
        Void.self,
        Error.self
    )
}

func deserialize<T, C, E: Error> (
    value: MessagePackValue,
    _ childType: C.Type,
    _ childErrorType: E.Type
) throws -> T {
    switch value {
    case .nil:
        if !(T.self == Optional<C>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(value)")
        }
        return Optional<C>.init(nilLiteral: ()) as! T
    case .bool(let val):
        if !(T.self == Bool.self || T.self == Optional<Bool>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .int(let val):
        if !(T.self == Int64.self || T.self == Optional<Int64>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .uint(let val):
        if !(T.self == UInt64.self || T.self == Optional<UInt64>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .float(let val):
        if !(T.self == Float.self || T.self == Optional<Float>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .double(let val):
        if !(T.self == Double.self || T.self == Optional<Double>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .string(let val):
        if !(T.self == String.self || T.self == Optional<String>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .binary(let val):
        if !(T.self == Data.self || T.self == Optional<Data>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    case .array(let val):
        if !(T.self == Array<C>.self || T.self == Optional<Array<C>>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match Array<\(C.self)> or Optional<Array<\(C.self)>>")
        }
        
        let mapped = try val.map { v in
            return try deserialize(value: v, C.self, E.self)
        } as Array<C>
        
        return mapped as! T
    case .map(let val):
        if T.self == CoreResponse.self {
            // TODO: Make sure that the Compiler checks that all cases on CoreResponse are handled
            if let example = val[.string("Example")] {
                let result: Result<Optional<String>, CoreFailure> = try deserialize(value: example, C.self, E.self)
                return CoreResponse.example(result) as! T
            } else {
                throw DecodingError.invalidValue(info: "Expected CoreResponse case, received \(value)")
            }
        } else if T.self == CoreFailure.self {
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
        } else if T.self == Result<C, E>.self {
            if let okay = val[.string("Ok")] {
                return Result<C, E>.success(try deserialize(value: okay, C.self, E.self)) as! T
            } else if let err = val[.string("Err")] {
                return Result<C, E>.failure(try deserialize(value: err, C.self, E.self)) as! T
            } else {
                throw DecodingError.invalidValue(info: "Expected Result<\(T.self), Error>, received \(value)")
            }
        }
        // TODO: Handle dictionary.
        throw DecodingError.invalidValue(info: "Map deserialization failed for \(T.self). Make sure you passed a child type and error type to deserialize. Example: deserialize(value: v, String.self, CoreFailure.self)")
    case .extended(_, let val):
        if !(T.self == Data.self || T.self == Optional<Data>.self) {
            throw DecodingError.invalidValue(info: "Expected type \(T.self), does not match \(type(of: val))")
        }
        return val as! T
    }
}
