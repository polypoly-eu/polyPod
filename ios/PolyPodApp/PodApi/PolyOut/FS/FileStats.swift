import Foundation

struct FileStats {
    let file: Bool
    let directory: Bool
    
    init(isDirectory: Bool) {
        file = !isDirectory
        directory = isDirectory
    }
    
    public var messagePackObject: MessagePackValue {
        var messagePackArray: [MessagePackValue] = []
        
        messagePackArray.append(["file", .bool(file)])
        messagePackArray.append(["directory", .bool(directory)])
        
        let object = MessagePackValue.array(["@polypoly-eu/podigree.FileStats", .array(messagePackArray)])
        
        return object
    }
}
