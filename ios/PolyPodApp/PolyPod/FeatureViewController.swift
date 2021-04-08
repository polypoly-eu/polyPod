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
    
    var featureName: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.title = featureName
        
        let contentController = WKUserContentController();
        MessageName.allCases.forEach {
            contentController.add(self, name: $0.rawValue)
        }
        
        contentController.installUserScript("messagePort", forMainFrameOnly: true)
        contentController.installUserScript("domConsole", forMainFrameOnly: false)
        contentController.installUserScript("podNav", forMainFrameOnly: false)
        
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController

        webView = WKWebView(frame: CGRect(), configuration: configuration)
        webView.scrollView.isScrollEnabled = false
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
        webView.rightAnchor.constraint(equalTo: view.rightAnchor).isActive = true
        webView.leftAnchor.constraint(equalTo: view.leftAnchor).isActive = true
        webView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true

        let featureUrl = FeaturesWallet.shared.featuresFileUrl.appendingPathComponent(featureName)
        let featureFileUrl = featureUrl.appendingPathComponent("pod.html")
        webView.loadFileURL(featureFileUrl, allowingReadAccessTo: featureUrl)
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
            case .Event:
                self.doHandleEvent(messageBody: body)
            case .PodNav:
                self.doHandlePodNavCommand(messageBody: body)
            }
        }
    }
    
    private func doHandleEvent(messageBody: [String: Any]) {
        PostOffice.shared.handleIncomingEvent(eventData: messageBody, completionHandler: { responseData in
            DispatchQueue.main.async { [weak self] in
                let javascriptCommand = "port1.postMessage(\(responseData));"
                self?.webView.evaluateJavaScript(javascriptCommand, completionHandler: { result, error in
                    if error != nil {
                        print("Received an error from JavaScript: \(error!)")
                    }
                })
            }
        })
    }
    
    private func doLog(data: [String: Any]) {
        guard let text = data["text"] as? String else {
            print("Error: WebView sent bad log message")
            return
        }
        
        print("WebView: " + text)
    }

    private func doHandlePodNavCommand(messageBody: [String: Any]) {
        guard let messageText = messageBody["text"] as? String else {
            print("Error: Bad podNav message - missing/unexpected message text: \(messageBody)")
            return
        }

        let textData = messageText.data(using: .utf8)!
        guard let jsonData =
                try? JSONSerialization.jsonObject(with: textData, options: [])
                as? [String: Any]
        else {
            print("Error: Bad podNav command message - invalid JSON data: \(messageBody)")
            return
        }

        guard let commandName = jsonData["name"] as? String
        else {
            print("Error: Bad podNav command message - missing/unexpected command name: \(jsonData)")
            return
        }

        let commandData = jsonData["data"]
        switch (commandName) {
        case "setTitle":
            self.title = commandData as? String
        case "setActiveActions":
            let actions = commandData as! [String]
            // TODO: Actually change the active actions
            print("setActiveActions(\(actions)) called")
        default:
            print("Error: Bad podNav command message - unknown command '\(commandName)'")
        }
    }
}

