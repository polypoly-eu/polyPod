import Foundation
import MessagePack

struct ExtendedData {
    let classname: String
    let properties: [String: Any]
    
    init(classname: String, propertyList: [[Any]]) {
        self.classname = classname
        var properties: [String: Any] = [:]
        for property in propertyList {
            let propertyName = property[0] as! String
            let propertyValue = property[1]
            properties[propertyName] = propertyValue
        }
        self.properties = properties
    }
    
    init(classname: String, properties: [String: Any]) {
        self.classname = classname
        self.properties = properties
    }
    
    var propertyList: [[Any]] {
        var propertyList: [[Any]] = []
        for (key, value) in properties {
            propertyList.append([key, value])
        }
        return propertyList
    }
}

class Bubblewrap {
    
    static func decode(messagePackValue: MessagePackValue) -> Any? {
        switch messagePackValue {
        case .bool(let value):
            return value
        case .int(let value):
            return value
        case .uint(let value):
            return value
        case .float(let value):
            return value
        case .double(let value):
            return value
        case .string(let string):
            return string
        case .binary(let data):
            return data
        case .array(let array):
            return array.map { decode(messagePackValue: $0) }
        case .map(let dict):
            var newDict: [String: Any] = [:]
            for (k, v) in dict {
                newDict[k.stringValue!] = decode(messagePackValue: v)
            }
            return newDict
        case .extended( _, let data):
            let unpackedData = try! unpackFirst(data)
            guard let decodedData = decode(messagePackValue: unpackedData) as? [Any] else { break }
            guard let classname = decodedData[0] as? String else { break }
            guard let propertyList = decodedData[1] as? [[Any]] else { break }
            return ExtendedData(classname: classname, propertyList: propertyList)
        case .nil:
            return nil
        }
        assert(false)
        return nil
    }
    
    static func encode(extendedData: ExtendedData) -> MessagePackValue {
        let classname = extendedData.classname
        let propertyList = extendedData.propertyList
        
        var messagePackPropertyList: [MessagePackValue] = []
        for property in propertyList {
            let propertyName = property[0] as! String
            let propertyValue = property[1]
            var value: MessagePackValue?
            switch propertyValue {
            case let asBool as Bool:
                value = .bool(asBool)
            case let asInt as Int64:
                value = .int(asInt)
            case let asUInt as UInt64:
                value = .uint(asUInt)
            case let asFloat as Float:
                value = .float(asFloat)
            case let asDouble as Double:
                value = .double(asDouble)
            case let asString as String:
                value = .string(asString)
            case let asData as Data:
                value = .binary(asData)
            case let asArray as [MessagePackValue]:
                value = .array(asArray)
            case let asExtendedData as ExtendedData:
                value = .extended(2, pack(encode(extendedData: asExtendedData)))
            default:
                continue
            }
            messagePackPropertyList.append(.array([.string(propertyName), value!]))
        }
        
        let endoced = MessagePackValue.array([.string(classname), .array(messagePackPropertyList)])
        return endoced
    }
}
