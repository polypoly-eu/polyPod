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
    static let fsKey = "fileStoreDict"
    static let fsPrefix = "polyPod://"
    
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
                    let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                    let newUrl = documentDirectory.appendingPathComponent(url.lastPathComponent)
                    if (FileManager.default.fileExists(atPath: newUrl.standardizedFileURL.path)) {
                        // TODO: Ask the user for a rewrite
                        try FileManager.default.removeItem(at: newUrl)
                    }
                    
                    try FileManager.default.moveItem(
                        at: url.standardizedFileURL,
                        to: newUrl)
                    try Zip.unzipFile(newUrl, destination: newUrl.deletingPathExtension(), overwrite: true, password: nil)

                    var fileStore = UserDefaults.standard.value(
                        forKey: PolyNav.fsKey
                    ) as? [String:String?] ?? [:]
                    let newUuid = PolyNav.fsPrefix + UUID().uuidString
                    fileStore[newUuid] = newUrl.lastPathComponent
                    UserDefaults.standard.set(fileStore, forKey: PolyNav.fsKey)
                    
                    completionHandler(newUuid)
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
            forKey: PolyNav.fsKey
        ) as? [String:String?] ?? [:]
        do {
            if (fileStore[fileId] != nil) {
                try FileManager.default.removeItem(atPath: fileStore[fileId]!!)
            }
        }
        catch {
        }
        fileStore.removeValue(forKey: fileId)
        UserDefaults.standard.set(fileStore, forKey: PolyNav.fsKey)
        completionHandler(nil)

    }
}
