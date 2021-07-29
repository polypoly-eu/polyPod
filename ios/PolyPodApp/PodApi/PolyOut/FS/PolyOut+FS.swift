import Foundation

extension PolyOut {
    func stat(path: String, completionHandler: @escaping (FileStats?, Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        
        var isDir : ObjCBool = false
        let exists = FileManager.default.fileExists(atPath: filePath.path, isDirectory: &isDir)
        if exists {
            completionHandler(FileStats(isDirectory: isDir.boolValue), nil)
        } else {
            completionHandler(nil, PodApiError.noSuchFile)
        }
    }
    
    func fileRead(path: String, options: [String: Any], completionHandler: @escaping (Any?, Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        
        do {
            if "utf-8" == options["encoding"] as? String {
                let content = try String(contentsOf: filePath, encoding: String.Encoding.utf8)
                completionHandler(content, nil)
            } else {
                let content = try Data(contentsOf: filePath)
                completionHandler(content, nil)
            }
        } catch {
            completionHandler(nil, error)
        }
    }
    
    func fileWrite(path: String, data: String, completionHandler: @escaping (Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        
        do {
            try data.write(to: filePath, atomically: false, encoding: String.Encoding.utf8)
            completionHandler(nil)
        } catch {
            completionHandler(error)
        }
    }

    func fileWrite(path: String, data: Data, completionHandler: @escaping (Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        let fileManager = FileManager.default
        do {
            try fileManager.createDirectory(at: fileStoragePath.appendingPathComponent("fb/"), withIntermediateDirectories: true, attributes: nil)
            try data.write(to: filePath, options: .completeFileProtection)
            completionHandler(nil)
        } catch {
            completionHandler(error)
        }
    }

    func fileDelete(path: String, completionHandler: @escaping (Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        let fileManager = FileManager.default
        do {
            try fileManager.removeItem(at: filePath)
            completionHandler(nil)
        } catch {
            completionHandler(error)
        }
    }

    func readDir(path: String, completionHandler: @escaping ([String]?, Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        let fileManager = FileManager.default
        do {
            let fileUrls = try fileManager.contentsOfDirectory(
                at: filePath,
                includingPropertiesForKeys: nil
            ).map { $0.lastPathComponent }
            completionHandler(fileUrls, nil)
        } catch {
            completionHandler(nil, error)
        }
    }
}
