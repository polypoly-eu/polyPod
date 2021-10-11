// Please remove this line and the empty one after it

import Foundation
import UIKit
import WebKit

enum CustomSchemeHandlerError: Error {
    case fileNotFound(fileName: String)
    case wrongProtocol(protocol: String)
}

extension FeatureWebView: WKURLSchemeHandler {
    
    func webView(_ webView: WKWebView,
                 start urlSchemeTask: WKURLSchemeTask) {
        
        guard let url = urlSchemeTask.request.url,
            let scheme = url.scheme,
            scheme == PolyNav.fsPrefix.replacingOccurrences(of: "://", with: "") else {
            urlSchemeTask.didFailWithError(CustomSchemeHandlerError.wrongProtocol(protocol: url?.scheme ?? ""))
                return
        }
        
        // Extract the required file name from the request.
        let urlString = url.absoluteString
        let index = urlString.index(urlString.startIndex, offsetBy: PolyNav.fsPrefix.count)
        let file = String(urlString[index..<urlString.endIndex])
        let path = (file as NSString).deletingPathExtension
        let ext = (file as NSString).pathExtension
        
        // Try and find the file in the app bundle.
        guard let fileBundleUrl = Bundle.main.url(forResource: path,
                                                  withExtension: ext) else {
            urlSchemeTask.didFailWithError(CustomSchemeHandlerError.fileNotFound(fileName: "\(file)"))
            return
        }
        
        // Load the data from the file and prepare a URLResponse.
        do {
            let data = try Data(contentsOf: fileBundleUrl)
            let response = URLResponse(url: url,
                                       mimeType: ext == "json" ? "application/json" : "application/octet-stream",
                                       expectedContentLength: data.count,
                                       textEncodingName: nil)
            
            // Fulfill the task.
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        } catch {
            urlSchemeTask.didFailWithError(error)
        }
    }
    
    /// Not needed here but should be implemented to stop loading in cases where
    /// The fulfilling of the request was a long running asynchronous operation
    /// That may not have finished.
    func webView(_ webView: WKWebView,
                 stop urlSchemeTask: WKURLSchemeTask) {
        
    }
}
