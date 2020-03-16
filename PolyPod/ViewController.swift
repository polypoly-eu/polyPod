//
//  ViewController.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 11.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    var webView: WKWebView!
    
    let preferencesFilename: String = "preferences"
    
    var preferences: [String: Any] = [:]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let storedPreferences = try? JSONSerialization.loadJSON(withFilename: preferencesFilename) as? [String : Any] {
            preferences = storedPreferences
        }
        
        preferences["directusCredentials"] = ["email": FILL_ME, "password": FILL_ME]
        
        let contentController = WKUserContentController();
        contentController.add(self, name: MessageName.Log.rawValue)
        contentController.add(self, name: MessageName.GetValue.rawValue)
        contentController.add(self, name: MessageName.SetValue.rawValue)
        contentController.add(self, name: MessageName.HttpRequest.rawValue)
        
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

        if let manifest = loadFeatureManifest() {
            let filePath = Bundle.main.path(forResource: "feature", ofType: "html")!
            var content = try! String(contentsOfFile: filePath)
            content = content.replacingOccurrences(of: "featureStyle", with: "\(manifest.style)")
            content = content.replacingOccurrences(of: "featureSource", with: "\(manifest.source)")
            content = content.replacingOccurrences(of: "featureName", with: "\(manifest.name)")
            webView.loadHTMLString(content, baseURL: Bundle.main.resourceURL)
        }
    }
    
    private func loadFeatureManifest() -> Manifest? {
        guard let filePath = Bundle.main.path(forResource: "polyExplorerManifest", ofType: "json") else { return nil }
        let fileUrl = URL(fileURLWithPath: filePath)
        guard let data = try? Data(contentsOf: fileUrl) else { return nil }
        let decoder = JSONDecoder()
        let manifest = try? decoder.decode(Manifest.self, from: data)
        return manifest
    }
}

extension ViewController: WKScriptMessageHandler {
    enum MessageName: String {
        case Log = "log"
        case GetValue = "getValue"
        case SetValue = "setValue"
        case HttpRequest = "httpRequest"
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let messageName = MessageName(rawValue: message.name) else { return }
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                return
            }
        
            switch messageName {
                case .Log:
                    guard let text = message.body as? String else { return }
                    print("WebView: " + text)
                case .GetValue:
                    guard let body = message.body as? [String: Any] else { return }
                    self.doGetValue(data: body)
                case .SetValue:
                    guard let body = message.body as? [String: Any] else { return }
                    self.doSetValue(data: body)
                case .HttpRequest:
                    guard let body = message.body as? [String: Any] else { return }
                    self.doHttpRequest(data: body)
            }
        }
    }
    
    private func doGetValue(data: [String: Any]) {
        // todo: add checks here
        
        var jsonData = ["id": data["id"]]
        
        let key = data["key"] as! String
       
        jsonData["result"] = preferences[key]
        
        self.sendToPostOffice(jsonObject: jsonData)
    }
    
    private func doSetValue(data: [String: Any]) {
        // todo: add checks here
        
        let jsonData = ["id": data["id"]]
        
        let key = data["key"] as! String
        
        if let rawValue = data["value"] as? String, let value = try? JSONSerialization.jsonObject(with: rawValue.data(using: .utf8)!, options: []) as? NSDictionary {
            
            preferences[key] = value
        
            try? JSONSerialization.save(jsonObject: preferences, toFilename: preferencesFilename)
        }
        
        self.sendToPostOffice(jsonObject: jsonData)
    }
    
    private func doHttpRequest(data: [String: Any]) {
        // todo: add checks here
        
        var jsonData = ["id": data["id"]]
        
        let url = URL(string: data["url"] as! String)!

        let method = data["method"] as! String
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let rawHeaders = data["headers"] as? String, let headers = try? JSONSerialization.jsonObject(with: rawHeaders.data(using: .utf8)!, options: []) as? NSDictionary {
            for (key, value) in headers {
                request.setValue(value as? String, forHTTPHeaderField: key as! String)
            }
        }
        
        if let body = data["body"] as? String, body.count > 0 {
            let postString = body
            request.httpBody = postString.data(using: .utf8)
        }
        
        let task = URLSession.shared.dataTask(with: request) {(data, response, error) in
            guard let data = data else { return }
            let result = String(data: data, encoding: .utf8)
            
            jsonData["result"] = result

            self.sendToPostOffice(jsonObject: jsonData)
        }

        task.resume()
    }
    
    private func sendToPostOffice(jsonObject: Any) {
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

