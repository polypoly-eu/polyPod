import Foundation
import Zip

enum PolyOutError: Error {
    case failedToParsePath(_ path: String)
    case platform(_ error: Error)
}

extension PolyOutError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .failedToParsePath(let path):
            return "Failed to parse path '\(path)'"
        case .platform(let error):
            return "Platform error: \(error)"
        }
    }
}

private func calculateFileSize(_ path: String) throws -> Int64 {
    let attributes = try FileManager.default.attributesOfItem(atPath: path)
    if attributes[.type] as! FileAttributeType != .typeDirectory {
        return attributes[.size] as! Int64
    }
    var totalSize: Int64 = 0
    let contents = try FileManager.default.contentsOfDirectory(atPath: path)
    for file in contents {
        totalSize += try calculateFileSize("\(path)/\(file)")
    }
    return totalSize
}

var readDirCache = Dictionary<String, [[String: String]]>()

extension PolyOut {
    static let fsKey = "fileStoreDict"
    static let fsProtocol = "polypod"
    static let fsPrefix = fsProtocol + "://"
    static let fsFilesRoot = "FeatureFiles"
    
    func featureFilesPath() -> URL {
        let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.resolvingSymlinksInPath()
        return documentDirectory.appendingPathComponent(PolyOut.fsFilesRoot).appendingPathComponent(activeFeature!.id)
    }
    
    private func pathFromUrl(url: String) -> URL? {
        let id = idFromUrl(url: url)

        return id != nil ? featureFilesPath().appendingPathComponent(id!) : nil
    }
    
    func pathFromId(id: String) -> URL {
        return featureFilesPath().appendingPathComponent(id)
    }
    
    private func idFromUrl(url: String) -> String? {
        if (!url.lowercased().starts(with: PolyOut.fsPrefix)) {
            return nil
        }
        
        // Previous polyPod builds used mixed case ("polyPod:") as the protocol
        let id = url
            .replacingOccurrences(of: PolyOut.fsPrefix, with: "", options: .caseInsensitive)
            .replacingOccurrences(of: PolyOut.fsFilesRoot, with: "")
            .trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        
        return id.removingPercentEncoding
    }
    
    func urlFromId(id: String) -> URL {
        return featureFilesPath().appendingPathComponent(id)
    }
    
    func stat(url: String, completionHandler: @escaping (FileStats?, Error?) -> Void) {
        let targetPath = pathFromUrl(url: url)
        guard let filePath = targetPath else {
            completionHandler(nil, PodApiError.noSuchFile(url))
            return
        }
        var isDir : ObjCBool = false
        let exists = FileManager.default.fileExists(atPath: filePath.path, isDirectory: &isDir)
        if exists {
            do {
                let format = DateFormatter()
                format.dateFormat = "dd-MM-yyyy"
                let attributes = try FileManager.default.attributesOfItem(atPath: filePath.path)
                let fileStore = UserDefaults.standard.value(
                    forKey: PolyOut.fsKey
                ) as? [String:String?] ?? [:]
                let time = attributes[.modificationDate] as! Date
                completionHandler(FileStats(
                    isDirectory: isDir.boolValue,
                    size: try calculateFileSize(filePath.path),
                    time: "\(Int(floor(time.timeIntervalSince1970)))",
                    name: fileStore[url] as? String ?? URL(fileURLWithPath: filePath.path).lastPathComponent,
                    id: idFromUrl(url: url) ?? ""
                ), nil)
            }
            catch {
                completionHandler(nil, PodApiError.unknown)
            }
        } else {
            Log.error("stat: No such file: \(filePath.path)")
            completionHandler(nil, PodApiError.noSuchFile(url))
        }
    }
    
    func fileRead(url: String, options: [String: Any], completionHandler: @escaping (Any?, Error?) -> Void) {
        do {
            guard let filePath = pathFromUrl(url: url) else {
                throw PodApiError.noSuchFile(url)
            }
            
            if "utf-8" == options["encoding"] as? String {
                let content = try String(contentsOf: filePath, encoding: String.Encoding.utf8)
                completionHandler(content, nil)
            } else {
                let content = try Data(contentsOf: filePath)
                completionHandler(content, nil)
            }
        } catch {
            Log.error("fileRead for \(url) failed: \(String(describing: error))")
            completionHandler(nil, PolyOutError.platform(error))
        }
    }
    
    func fileWrite(url: String, data: String, completionHandler: @escaping (Error?) -> Void) {
        guard let filePath = pathFromUrl(url: url) else {
            completionHandler(PodApiError.noSuchFile(url))
            return
        }

        do {
            try data.write(to: filePath, atomically: false, encoding: String.Encoding.utf8)
            completionHandler(nil)
        } catch {
            completionHandler(PolyOutError.platform(error))
        }
    }
    
    func readDir(url: String, completionHandler: @escaping ([[String: String]]?, Error?) -> Void) {
        let fileStore = UserDefaults.standard.value(
            forKey: PolyOut.fsKey
        ) as? [String:String?] ?? [:]
        // List entries of a zip file
        if (url != "") {
            let cachedEntries = readDirCache[url]
            if (cachedEntries != nil) {
                completionHandler(cachedEntries, nil)
                return
            }
            let targetUrl = pathFromId(id: url)
            var entries = [[String: String]]()
            if let enumerator = FileManager.default.enumerator(at: targetUrl, includingPropertiesForKeys: [.isRegularFileKey], options: [.skipsHiddenFiles, .skipsPackageDescendants]) {
                for case let fileURL as URL in enumerator {
                    let relativePath = fileURL.resolvingSymlinksInPath().absoluteString.replacingOccurrences(
                        of: targetUrl.absoluteString,
                        with: ""
                    )
                    let fileId = PolyOut.fsFilesRoot + "/" + url + "/" + relativePath
                    entries.append(["id": fileId, "path": relativePath])
                }
            }
            readDirCache[url] = entries
            completionHandler(entries, nil)
            return
        }
        
        // Under certain circumstances, fileStore contained files that don't
        // actually exist - for now we just ignore them in readDir, but it
        // might be smarter to clean fileStore automatically at some point.
        let storedFiles = fileStore.keys.filter { key in
            guard let path = pathFromUrl(url: key)?.path else {
                return false
            }
            return FileManager.default.fileExists(atPath: path)
        }
        let idPrefix = "\(PolyOut.fsPrefix)\(PolyOut.fsFilesRoot)/"
        let entries = storedFiles.map {[
            "id": $0,
            "path": $0.replacingOccurrences(of: idPrefix, with: "")
        ]}
        completionHandler(entries, nil)
    }
    
    /// destURL has this form :: PolyOut.fsPrefix + PolyOut.fsFilesRoot + "/" + id
    func importArchive(url: String, destUrl: String? = nil, completionHandler: @escaping (String?) -> Void) {
        guard let url = URL(string: url) else {
            completionHandler(nil)
            return
        }
        
        DispatchQueue.global(qos: .background).async {
            do {
                let id = { () -> String in
                    if let destUrl = destUrl, let destURL = URL(string: destUrl) {
                        return destURL.lastPathComponent
                    }
                    return UUID().uuidString
                }()
                if id.isEmpty {
                    // TODO
                }
                let targetUrl = self.urlFromId(id: id)
                let baseUrl = targetUrl.deletingLastPathComponent()
                if !FileManager.default.fileExists(atPath: baseUrl.path) {
                    try FileManager.default.createDirectory(
                        at: baseUrl,
                        withIntermediateDirectories: true
                    )
                }
                try Zip.unzipFile(
                    url,
                    destination: targetUrl,
                    overwrite: true,
                    password: nil
                )
                try FileManager.default.removeItem(at: url)
                
                let newUrl = PolyOut.fsPrefix + PolyOut.fsFilesRoot + "/" + id
                var fileStore = UserDefaults.standard.value(
                    forKey: PolyOut.fsKey
                ) as? [String:String?] ?? [:]
                fileStore[newUrl] = url.lastPathComponent
                UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
                
                completionHandler(newUrl)
            }
            catch {
                Log.error("importArchive for '\(url)' failed: \(error)")
                completionHandler(nil)
            }
        }
    }
    
    func removeArchive(fileId: String, completionHandler: (Error?) -> Void) {
        do {
            let path = pathFromId(id: fileId).path
            if FileManager.default.fileExists(atPath: path) {
                try FileManager.default.removeItem(atPath: path)
            }
        }
        catch {
        }
        var fileStore = UserDefaults.standard.value(
            forKey: PolyOut.fsKey
        ) as? [String:String?] ?? [:]
        fileStore.removeValue(forKey: urlFromId(id: fileId).path)
        UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
        completionHandler(nil)
    }
}
