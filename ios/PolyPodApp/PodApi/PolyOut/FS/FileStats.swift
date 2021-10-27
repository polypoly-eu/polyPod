import Foundation
import MessagePack

struct FileStats {
    let file: Bool
    let directory: Bool
    let size: Int64
    let time: String
    let name: String
    let id: String
    
    init(isDirectory: Bool, size: Int64, time: String, name: String, id: String) {
        file = !isDirectory
        directory = isDirectory
        self.size = size
        self.time = time
        self.name = name
        self.id = id
    }
    
    public var messagePackObject: MessagePackValue {
        var messagePackArray: [MessagePackValue] = []
        
        messagePackArray.append(["file", .bool(file)])
        messagePackArray.append(["directory", .bool(directory)])
        messagePackArray.append(["size", .int(size)])
        messagePackArray.append(["time", .string(time)])
        messagePackArray.append(["name", .string(name)])
        messagePackArray.append(["id", .string(id)])

        let object = MessagePackValue.array(["@polypoly-eu/remote-pod.FileStats", .array(messagePackArray)])
        
        return object
    }
}
