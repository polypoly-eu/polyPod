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

extension PolyOut {
    static let fsKey = "fileStoreDict"
    static let fsPrefix = "polyPod://"
    static let fsFilesRoot = "FeatureFiles"
    
    static func featureFilesPath() -> URL {
        let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.resolvingSymlinksInPath()
        // TODO: Hard coded for the sake of speed, but we need to determine the active feature's ID here
        let featureId = "facebookImport"
        return documentDirectory.appendingPathComponent(PolyOut.fsFilesRoot).appendingPathComponent(featureId)
    }
    
    private static func pathFromPathOrId(pathOrId: String) -> URL {
        var path = pathOrId
        if (pathOrId.starts(with: PolyOut.fsPrefix)) {
            path = pathOrId.replacingOccurrences(of: PolyOut.fsPrefix, with: "")
        }
        return featureFilesPath().appendingPathComponent(path)
    }
    
    func stat(pathOrId: String, completionHandler: @escaping (FileStats?, Error?) -> Void) {
        let filePath = PolyOut.pathFromPathOrId(pathOrId: pathOrId)
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
                completionHandler(FileStats(
                    isDirectory: isDir.boolValue,
                    size: attributes[.size] as! Int64,
                    time: format.string(from: attributes[.creationDate] as! Date),
                    name: fileStore[pathOrId] as? String ?? URL(fileURLWithPath: filePath.path).lastPathComponent,
                    id: pathOrId
                ), nil)
            }
            catch {
                completionHandler(nil, PodApiError.unknown)
            }
        } else {
            print("stat: No such file: \(filePath.path)")
            completionHandler(nil, PodApiError.noSuchFile(filePath.path))
        }
    }
    
    func fileRead(pathOrId: String, options: [String: Any], completionHandler: @escaping (Any?, Error?) -> Void) {
        do {
            var filePath = PolyOut.pathFromPathOrId(pathOrId: pathOrId)
            if (pathOrId.starts(with: PolyOut.fsPrefix)) {
                guard var testString = pathOrId.removingPercentEncoding else {
                    throw PolyOutError.failedToParsePath(pathOrId)
                }
                testString.removeSubrange(testString.startIndex...PolyOut.fsPrefix.index(before: PolyOut.fsPrefix.endIndex))
                let parts = testString.split(separator: "/")
                if (parts.count > 1) {
                    filePath = PolyOut.pathFromPathOrId(pathOrId: PolyOut.fsPrefix + parts[0]).deletingPathExtension()
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
        let filePath = PolyOut.pathFromPathOrId(pathOrId: pathOrId)

        do {
            try data.write(to: filePath, atomically: false, encoding: String.Encoding.utf8)
            completionHandler(nil)
        } catch {
            completionHandler(PolyOutError.platform(error))
        }
    }
    func readdir(dir: String, completionHandler: @escaping ([String]?, Error?) -> Void) {
        let fileStore = UserDefaults.standard.value(
            forKey: PolyOut.fsKey
        ) as? [String:String?] ?? [:]
        // List entries of a zip file
        if (dir != "") {
            let targetUrl = PolyOut.pathFromPathOrId(pathOrId: dir)
            var entries = [String]()
            if let enumerator = FileManager.default.enumerator(at: targetUrl, includingPropertiesForKeys: [.isRegularFileKey], options: [.skipsHiddenFiles, .skipsPackageDescendants]) {
                for case let fileURL as URL in enumerator {
                    let filePath = fileURL.resolvingSymlinksInPath().absoluteString.replacingOccurrences(
                        of: targetUrl.absoluteString,
                        with: dir + "/"
                    )
                    entries.append(filePath)
                }
            }
            
            completionHandler(entries, nil)
            return
        }
        completionHandler(Array(fileStore.keys), nil)
    }
}
