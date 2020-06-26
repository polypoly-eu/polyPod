//
//  BubbleWrap.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 25.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

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
        default:
            break
        }
        assert(false)
    }
}
