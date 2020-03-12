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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let contentController = WKUserContentController();
        contentController.add(self, name: MessageName.Log.rawValue)
        contentController.add(self, name: MessageName.HttpGetRequest.rawValue)
        
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
        guard let filePath = Bundle.main.path(forResource: "manifest", ofType: "json") else { return nil }
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
        case HttpGetRequest = "httpGetRequest"
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? NSDictionary else { return }
        guard let messageName = MessageName(rawValue: message.name) else { return }
        
        DispatchQueue.global(qos: .default).async { [weak self] in
            guard let self = self else {
                return
            }
        
            switch messageName {
                case .Log:
                    if let output = body["text"] as? String {
                        print("WebView: " + output)
                    }
                case .HttpGetRequest:
                    self.doHttpGetRequest(data: body)
            }
        }
    }
    
    func doHttpGetRequest(data: NSDictionary) {
        // todo: add checks here
        
        var jsonData = ["id": data["id"]]
        
        let url = URL(string: data["url"] as! String)!

        let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
            guard let data = data else { return }
            let result = String(data: data, encoding: .utf8)
            
            jsonData["result"] = result

            let json = try! JSONSerialization.data(withJSONObject: jsonData, options:  [])

            guard let jsonString = String(data: json, encoding: String.Encoding.utf8) else { return }
            
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

        task.resume()
    }
}

