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
    func pickFile(completionHandler: @escaping (String?) -> Void)
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
    
    func pickFile(completionHandler: @escaping (String?) -> Void) {
        delegate?.doHandleImportFile { url in
            completionHandler(url?.absoluteString)
        }
    }
}
