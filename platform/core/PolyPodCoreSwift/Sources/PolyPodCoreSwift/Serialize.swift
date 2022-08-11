import PolyPodCore
import Foundation
import MessagePack

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
