//
//  FeatureViewController.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 11.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit
import WebKit

class FeatureViewController: UIViewController {

    var webView: WKWebView!
    
    let preferencesFilename: String = "preferences"
    
    var preferences: [String: Any] = [:]
    
    var featureName: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let storedPreferences = try? JSONSerialization.loadJSON(withFilename: preferencesFilename) as? [String : Any] {
            preferences = storedPreferences
        }
        
        preferences["directusCredentials"] = ["email": "api@polypoly.eu", "password": "v~[U[f<{A5s|(<O3'{(9%5{Bc"]
        
        let contentController = WKUserContentController();
        MessageName.allCases.forEach {
            contentController.add(self, name: $0.rawValue)
        }
        
        contentController.installUserScript("domConsole")
        contentController.installUserScript("postOffice")
        contentController.installUserScript("pod")
        
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController

        webView = WKWebView(frame: CGRect(), configuration: configuration)
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
        webView.rightAnchor.constraint(equalTo: view.rightAnchor).isActive = true
        webView.leftAnchor.constraint(equalTo: view.leftAnchor).isActive = true
        webView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true

        let featureUrl = FeaturesWallet.shared.featuresFileUrl.appendingPathComponent(featureName)
        if let manifest = loadFeatureManifest(featureUrl) {
            let filePath = Bundle.main.path(forResource: "feature", ofType: "html")!
            var content = try! String(contentsOfFile: filePath)
            content = content.replacingOccurrences(of: "featureStyle", with: "\(manifest.style)")
            content = content.replacingOccurrences(of: "featureSource", with: "\(manifest.source)")
            content = content.replacingOccurrences(of: "featureName", with: "\(manifest.name)")
            webView.loadHTMLString(content, baseURL: featureUrl)
        }
    }
    
    private func loadFeatureManifest(_ url: URL) -> Manifest? {
        let filePath = url.appendingPathComponent("Manifest.json")
        guard let data = try? Data(contentsOf: filePath) else { return nil }
        let decoder = JSONDecoder()
        let manifest = try? decoder.decode(Manifest.self, from: data)
        return manifest
    }

}

extension FeatureViewController: WKScriptMessageHandler {
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let messageName = MessageName(rawValue: message.name) else { return }
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            guard let body = message.body as? [String: Any] else { return }
            
            switch messageName {
            case .Log:
                self.doLog(data: body)
            case .GetValue:
                self.doGetValue(data: body)
            case .SetValue:
                self.doSetValue(data: body)
            case .HttpRequest:
                self.doHttpRequest(data: body)
            case .AddQuads:
                self.doAddQuads(data: body)
            case .SelectQuads:
                self.doSelectQuads(data: body)
            }
        }
    }
    
    private func doLog(data: [String: Any]) {
        guard let text = data["text"] as? String else {
            print("Error: WebView sent bad log message")
            return
        }
        
        print("WebView: " + text)
    }
    
    private func doGetValue(data: [String: Any]) {
        // todo: add checks here
        
        let requestId = data["id"] as! NSNumber
        
        let key = data["key"] as! String
       
        let value = sharedPodApi.preferences.getValue(key: key)
        
        self.sendToPostOffice(requestId: requestId, result: value)
    }
    
    private func doSetValue(data: [String: Any]) {
        // todo: add checks here
        
        let requestId = data["id"] as! NSNumber
        
        let key = data["key"] as! String
        
        if let rawValue = data["value"] as? String, let value = try? JSONSerialization.jsonObject(with: rawValue.data(using: .utf8)!, options: []) {
            
            let _ = sharedPodApi.preferences.setValue(key: key, value: value)
        }
        
        self.sendToPostOffice(requestId: requestId, result: nil)
    }
    
    private func doHttpRequest(data: [String: Any]) {
        // todo: add checks here
        
        let requestId = data["id"] as! NSNumber
        let requestData = data["request"] as! [String: Any]
        
        sharedPodApi.polyOut.makeHttpRequest(requestData: requestData) { (jsonData) in
            self.sendToPostOffice(requestId: requestId, result: jsonData)
        }
    }
    
    private func doAddQuads(data: [String: Any]) {
        // todo: add checks here
        
        let requestId = data["id"] as! NSNumber

        if let quads = data["quads"] as? [[String: Any]] {
            sharedPodApi.polyIn.addQuads(quads: quads)
        }

        self.sendToPostOffice(requestId: requestId, result: nil)
    }
    
    private func doSelectQuads(data: [String: Any]) {
        // todo: add checks here

        let requestId = data["id"] as! NSNumber
        
        let matcher = data["matcher"] as? [[String: Any]]
        
        let result: Any? = sharedPodApi.polyIn.selectQuads(matcher: matcher)

        self.sendToPostOffice(requestId: requestId, result: result)
    }
    
    private func sendToPostOffice(requestId: NSNumber, result: Any?) {
        var jsonObject: [String: Any] = ["id": requestId]
        if let result = result {
            jsonObject["result"] = result
        }
        
        let json = try! JSONSerialization.data(withJSONObject: jsonObject, options: [])

        guard let jsonString = String(data: json, encoding: .utf8) else { return }
        
        let javascriptCommand = "postOffice.receiveMessage(\(jsonString));"
        
        DispatchQueue.main.async { [weak self] in
            self?.webView.evaluateJavaScript(javascriptCommand, completionHandler: { result, error in
                if error == nil {
                    print("JavaScript execution successful")
                } else {
                    print("Received an error from JavaScript: \(error!)")
                }
            })
        }
    }
}

