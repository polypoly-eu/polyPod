import Foundation
import MessagePack

struct Stats {
    let directory: Bool
    let size: Int64
    let time: String
    let name: String
    let id: String
    
    public var messagePackObject: MessagePackValue {
        var messagePackMap: [MessagePackValue: MessagePackValue] = [:]
        messagePackMap["directory"] = .bool(directory)
        messagePackMap["size"] = .int(size)
        messagePackMap["time"] = .string(time)
        messagePackMap["name"] = .string(name)
        messagePackMap["id"] = .string(id)
        return MessagePackValue.map(messagePackMap)
    }
}
