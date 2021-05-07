import UIKit
import SwiftUI

protocol PolyNavProtocol {
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void)
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
}

class PolyNav: PolyNavProtocol {
    init() {
        webView = nil
    }
    
    var webView: FeatureWebView?
    
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        webView?.doHandleSetTitle(title: title)
    }
    
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void) {
        webView?.doHandleSetActiveActions(actions: actions)
    }
    
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        webView?.doHandleOpenUrl(url: target)
    }
    
}
