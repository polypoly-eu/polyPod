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
            guard let url = url else {
                completionHandler(nil)
                return
            }

            do {
                let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                // TODO: Hard coded for the sake of speed, but we need to determine the active feature's ID here
                let featureId = "facebookImport"
                let featureFilesPath = documentDirectory.appendingPathComponent(PolyNav.fsFilesRoot).appendingPathComponent(featureId)
                if !FileManager.default.fileExists(atPath: featureFilesPath.path) {
                    try FileManager.default.createDirectory(at: featureFilesPath, withIntermediateDirectories: true)
                }

                let newUrl = featureFilesPath.appendingPathComponent(url.lastPathComponent)
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
                let newUuid = PolyNav.fsPrefix + "/" + PolyNav.fsFilesRoot + "/" + UUID().uuidString
                fileStore[newUuid] = "\(PolyNav.fsFilesRoot)/\(featureId)/\(newUrl.lastPathComponent)"
                UserDefaults.standard.set(fileStore, forKey: PolyNav.fsKey)

                completionHandler(newUuid)
            }
            catch {
                print(error)
                completionHandler(nil)
            }

            do {
                let featureFilesPath = PolyOut.featureFilesPath()
                if !FileManager.default.fileExists(atPath: featureFilesPath.path) {
                    try FileManager.default.createDirectory(at: featureFilesPath, withIntermediateDirectories: true)
                }

                let newId = UUID().uuidString
                let targetUrl = featureFilesPath.appendingPathComponent(newId)
                try Zip.unzipFile(url, destination: targetUrl, overwrite: true, password: nil)
                try FileManager.default.removeItem(at: url)

                let newUrl = PolyOut.fsPrefix + newId
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
