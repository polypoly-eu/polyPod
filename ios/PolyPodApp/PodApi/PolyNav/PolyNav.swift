import UIKit
import SwiftUI
import Zip

enum PolyNavError: Error {
    case protocolError(_ protocol: String)
}

extension PolyNavError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .protocolError(let providedProtocol):
            return "Bad protocol '\(providedProtocol)'"
        }
    }
}

protocol PolyNavProtocol {
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void)
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
    func importFile(completionHandler: @escaping (String?) -> Void)
    func removeFile(fileId: String, completionHandler: (Error?) -> Void)
}

protocol PolyNavDelegate {
    func doHandleSetTitle(title: String)
    func doHandleSetActiveActions(actions: [String])
    func doHandleOpenUrl(url: String)
    func doHandleImportFile(completion: @escaping (URL?) -> Void)
}

class PolyNav: PolyNavProtocol {
    init() {
        delegate = nil
    }
    
    var delegate: PolyNavDelegate?
    
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        delegate?.doHandleSetTitle(title: title)
    }
    
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void) {
        delegate?.doHandleSetActiveActions(actions: actions)
    }
    
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        delegate?.doHandleOpenUrl(url: target)
    }
    
    func importFile(completionHandler: @escaping (String?) -> Void) {
        delegate?.doHandleImportFile() { url in
            guard let url = url else {
                completionHandler(nil)
                return
            }
            
            do {
                let newId = UUID().uuidString
                let targetUrl = PolyOut.urlFromId(id: newId)
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
                
                let newUrl = PolyOut.fsPrefix + PolyOut.fsFilesRoot + "/" + newId
                var fileStore = UserDefaults.standard.value(
                    forKey: PolyOut.fsKey
                ) as? [String:String?] ?? [:]
                fileStore[newUrl] = url.lastPathComponent
                UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
                
                completionHandler(newUrl)
            }
            catch {
                print("importFile for '\(url)' failed: \(error)")
                completionHandler(nil)
            }
        }
    }
    
    func removeFile(fileId: String, completionHandler: (Error?) -> Void) {
        do {
            let path = PolyOut.pathFromId(id: fileId).path
            if FileManager.default.fileExists(atPath: path) {
                try FileManager.default.removeItem(atPath: path)
            }
        }
        catch {
        }
        var fileStore = UserDefaults.standard.value(
            forKey: PolyOut.fsKey
        ) as? [String:String?] ?? [:]
        fileStore.removeValue(forKey: PolyOut.urlFromId(id: fileId).path)
        UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
        completionHandler(nil)
    }
}
