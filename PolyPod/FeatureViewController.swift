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
        contentController.add(self, name: MessageName.Log.rawValue)
        contentController.add(self, name: MessageName.GetValue.rawValue)
        contentController.add(self, name: MessageName.SetValue.rawValue)
        contentController.add(self, name: MessageName.HttpRequest.rawValue)
        contentController.add(self, name: MessageName.AddQuads.rawValue)
        contentController.add(self, name: MessageName.SelectQuads.rawValue)
        
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
        guard let filePath = Bundle.main.path(forResource: featureName + "Manifest", ofType: "json") else { return nil }
        let fileUrl = URL(fileURLWithPath: filePath)
        guard let data = try? Data(contentsOf: fileUrl) else { return nil }
        let decoder = JSONDecoder()
        let manifest = try? decoder.decode(Manifest.self, from: data)
        return manifest
    }

}

extension FeatureViewController: WKScriptMessageHandler {
    enum MessageName: String {
        case Log = "log"
        case GetValue = "getValue"
        case SetValue = "setValue"
        case HttpRequest = "httpRequest"
        case AddQuads = "addQuads"
        case SelectQuads = "selectQuads"
    }
    
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
        
        let requestData = data["request"] as! [String: Any]
        
        let url = URL(string: requestData["url"] as! String)!

        let method = requestData["method"] as! String
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let rawHeaders = requestData["headers"] as? String, let headers = try? JSONSerialization.jsonObject(with: rawHeaders.data(using: .utf8)!, options: []) as? NSDictionary {
            for (key, value) in headers {
                request.setValue(value as? String, forHTTPHeaderField: key as! String)
            }
        }
        
        if let body = requestData["body"] as? String, body.count > 0 {
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
    
    private func doAddQuads(data: [String: Any]) {
        // todo: add checks here
        
        print("functionality missing: doAddQuads")
        
        let jsonData = ["id": data["id"]]
        
        let quads = data["quads"] as? [[String: Any]]

        let success = try? JSONSerialization.save(jsonObject: quads, toFilename: "quads")
        
        self.sendToPostOffice(jsonObject: jsonData)
    }
    
    private func doSelectQuads(data: [String: Any]) {
        // todo: add checks here
        
        print("functionality missing: doSelectQuads")
        
        var jsonData = ["id": data["id"]]
        
        let matcher = data["matcher"] as? [[String: Any]]
        
        if let storedQuads = try? JSONSerialization.loadJSON(withFilename: "quads") as? [[String : Any]] {
            jsonData["result"] = storedQuads
        }
        
        self.sendToPostOffice(jsonObject: jsonData)
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

