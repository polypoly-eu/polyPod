import UIKit
import SwiftUI
import Zip

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
            if let url = url {
                do {
                    let featureFilesPath = PolyOut.featureFilesPath()
                    if !FileManager.default.fileExists(atPath: featureFilesPath.path) {
                        try FileManager.default.createDirectory(at: featureFilesPath, withIntermediateDirectories: true)
                    }
                    
                    let newId = UUID().uuidString
                    let targetUrl = featureFilesPath.appendingPathComponent(newId)
                    try Zip.unzipFile(url, destination: targetUrl, overwrite: true, password: nil)
                    
                    let newUrl = PolyOut.fsPrefix + newId
                    var fileStore = UserDefaults.standard.value(
                        forKey: PolyOut.fsKey
                    ) as? [String:String?] ?? [:]
                    fileStore[newUrl] = url.lastPathComponent
                    UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
                    
                    completionHandler(newUrl)
                }
                catch {
                    print(error)
                    completionHandler(nil)
                }
                return
            }
            completionHandler(nil)
        }
    }
    
    func removeFile(fileId: String, completionHandler: (Error?) -> Void) {
        var fileStore = UserDefaults.standard.value(
            forKey: PolyOut.fsKey
        ) as? [String:String?] ?? [:]
        do {
            if (fileStore[fileId] != nil) {
                try FileManager.default.removeItem(atPath: fileStore[fileId]!!)
            }
        }
        catch {
        }
        fileStore.removeValue(forKey: fileId)
        UserDefaults.standard.set(fileStore, forKey: PolyOut.fsKey)
        completionHandler(nil)

    }
}
