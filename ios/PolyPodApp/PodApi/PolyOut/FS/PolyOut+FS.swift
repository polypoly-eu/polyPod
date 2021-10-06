import Foundation
import Zip

enum PolyOutError: Error {
    case failedToParsePath(_ path: String)
    case platform(_ error: Error)
    case noEntryForArchive(_ archive: String)
}

extension PolyOutError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .failedToParsePath(let path):
            return "Failed to parse path '\(path)'"
        case .platform(let error):
            return "Platform error: \(error)"
        case .noEntryForArchive(let archive):
            return "No entry found for archive `\(archive)'"
        }
    }
}

extension PolyOut {
    private func pathFromPathOrId(pathOrId: String) -> URL {
        var path = pathOrId
        if (pathOrId.starts(with: PolyNav.fsPrefix)) {
            let fileStore = UserDefaults.standard.value(
                forKey: PolyNav.fsKey
            ) as? [String:String?] ?? [:]

            path = (fileStore[pathOrId] ?? "") ?? ""
        }
        return fileStoragePath.appendingPathComponent(path)
    }
    func stat(pathOrId: String, completionHandler: @escaping (FileStats?, Error?) -> Void) {
        let filePath = pathFromPathOrId(pathOrId: pathOrId)
        var isDir : ObjCBool = false
        let exists = FileManager.default.fileExists(atPath: filePath.path, isDirectory: &isDir)
        if exists {
            do {
                let format = DateFormatter()
                format.dateFormat = "dd-MM-yyyy"
                let attributes = try FileManager.default.attributesOfItem(atPath: filePath.path)
                completionHandler(FileStats(
                    isDirectory: isDir.boolValue,
                    size: attributes[.size] as! Int64,
                    time: format.string(from: attributes[.creationDate] as! Date),
                    name: URL(fileURLWithPath: filePath.path).lastPathComponent,
                    id: pathOrId
                ), nil)
            }
            catch {
                completionHandler(nil, PodApiError.unknown)
            }
        } else {
            completionHandler(nil, PodApiError.noSuchFile)
        }
    }
    
    func fileRead(pathOrId: String, options: [String: Any], completionHandler: @escaping (Any?, Error?) -> Void) {
        do {
            var filePath = pathFromPathOrId(pathOrId: pathOrId)
            if (pathOrId.starts(with: PolyNav.fsPrefix)) {
                guard var testString = pathOrId.removingPercentEncoding else {
                    throw PolyOutError.failedToParsePath(pathOrId)
                }
                testString.removeSubrange(testString.startIndex...PolyNav.fsPrefix.index(before: PolyNav.fsPrefix.endIndex))
                let parts = testString.split(separator: "/")
                if (parts.count > 1) {
                    filePath = pathFromPathOrId(pathOrId: PolyNav.fsPrefix + parts[0]).deletingPathExtension()
                    let endIndex = testString.firstIndex(of: "/")!
                    testString.removeSubrange(
                        testString.startIndex...endIndex
                    )
                    filePath.appendPathComponent(testString)
                }
            }
            
            if "utf-8" == options["encoding"] as? String {
                let content = try String(contentsOf: filePath, encoding: String.Encoding.utf8)
                completionHandler(content, nil)
            } else {
                let content = try Data(contentsOf: filePath)
                completionHandler(content, nil)
            }
        } catch {
            print(error)
            completionHandler(nil, PolyOutError.platform(error))
        }
    }
    
    func fileWrite(pathOrId: String, data: String, completionHandler: @escaping (Error?) -> Void) {
        let filePath = pathFromPathOrId(pathOrId: pathOrId)

        do {
            try data.write(to: filePath, atomically: false, encoding: String.Encoding.utf8)
            completionHandler(nil)
        } catch {
            completionHandler(PolyOutError.platform(error))
        }
    }
    func readdir(dir: String, completionHandler: @escaping ([String]?, Error?) -> Void) {
        let fileStore = UserDefaults.standard.value(
            forKey: PolyNav.fsKey
        ) as? [String:String?] ?? [:]
        // List entries of a zip file
        if (dir != "") {
            guard let archivePath = fileStore[dir] as? String else {
                print("No entry for archive: \(dir)")
                completionHandler(nil, PolyOutError.noEntryForArchive(dir))
                return
            }
            let targetUrl = fileStoragePath.appendingPathComponent(archivePath).deletingPathExtension()
            var entries = [String]()
            if let enumerator = FileManager.default.enumerator(at: targetUrl, includingPropertiesForKeys: [.isRegularFileKey], options: [.skipsHiddenFiles, .skipsPackageDescendants]) {
                for case let fileURL as URL in enumerator {
                    let filePath = fileURL.resolvingSymlinksInPath().absoluteString.replacingOccurrences(of: targetUrl.absoluteString, with: dir)
                    entries.append(filePath)
                }
            }
            
            completionHandler(entries, nil)
            return
        }
        completionHandler(Array(fileStore.keys), nil)
    }
}
