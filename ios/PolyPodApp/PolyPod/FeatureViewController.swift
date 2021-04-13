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
    var feature: Feature!

    private var backButton: UIBarButtonItem?
    private var infoButton: UIBarButtonItem?
    private var searchButton: UIBarButtonItem?
    private var activeActions: [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()

        title = feature.name

        super.viewDidLoad()

        initNavigationBar()

        let contentController = WKUserContentController();
        MessageName.allCases.forEach {
            contentController.add(self, name: $0.rawValue)
        }

        contentController.installUserScript("messagePort", forMainFrameOnly: true)
        contentController.installUserScript("domConsole", forMainFrameOnly: false)
        contentController.installUserScript("podNav", forMainFrameOnly: false)

        // The original idea was that the feature explicitly loads pod.js, but in order to
        // still support the polyfill-based development approach, we explicitly inject it,
        // at least for now.
        contentController.installUserScript("pod", forMainFrameOnly: false)

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

        let featureUrl = feature.path
        let featureFileUrl = featureUrl.appendingPathComponent("pod.html")
        webView.loadFileURL(featureFileUrl, allowingReadAccessTo: featureUrl)
    }

    private func initNavigationBar() {
        navigationItem.hidesBackButton = true
        backButton = UIBarButtonItem(title: "Close",
                                     style: UIBarButtonItem.Style.plain,
                                     target: self,
                                     action: #selector(FeatureViewController.back))
        navigationItem.leftBarButtonItem = backButton

        infoButton = UIBarButtonItem(title: "Info",
                                     style: UIBarButtonItem.Style.plain,
                                     target: self,
                                     action: #selector(FeatureViewController.info))

        searchButton = UIBarButtonItem(title: "Search",
                                       style: UIBarButtonItem.Style.plain,
                                       target: self,
                                       action: #selector(FeatureViewController.search))
    }

    @objc func back() {
        if !triggerAction("back") {
            navigationController?.popViewController(animated: true)
        }
    }

    @objc func search() {
        triggerAction("search")
    }

    @objc func info() {
        triggerAction("info")
    }

    @discardableResult private func triggerAction(_ action: String) -> Bool {
        if !activeActions.contains(action) {
            return false
        }

        // There is already a mechanism for sending messages to the feature's iframe,
        // we should use that here instead of opening up a new channel.
        let script = """
        document.getElementById('harness').contentWindow.postMessage({
            command: 'triggerPodNavAction',
            action: '\(action)'
        }, '*')
        """
        webView.evaluateJavaScript(script) { (_, error) in
            if error != nil {
                print("Failed to trigger podNav action '\(action)': \(String(describing: error))")
            }
        }
        return true
    }

    private func openUrl(_ target: String) {
        guard let urlString = feature.findUrl(target: target) else {
            let alert = UIAlertController(
                title: "",
                message: """
                Ich habe \(feature.name) davon abgehalten, eine URL zu öffnen:
                \(target)
                """,
                preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true, completion: nil)
            return
        }
        guard let url = URL(string: urlString) else {
            print("Error: Invalid URL format: \(urlString)")
            return
        }
        let alert = UIAlertController(
            title: "",
            message: """
            \(feature.name) möchte eine URL in Ihrem Browser öffnen:

            \(urlString)

            Zulassen?
            """,
            preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(
                            title: "Ja",
                            style: .default,
                            handler: { (action: UIAlertAction!) in
                                UIApplication.shared.open(url)
                            }))
        alert.addAction(UIAlertAction(title: "Nein", style: .default))
        present(alert, animated: true, completion: nil)
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
                // We should probably use an event message for this instead, rather than a custom new one.
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
            title = commandData as? String
        case "setActiveActions":
            activeActions = commandData as! [String]
            backButton?.title = activeActions.contains("back") ? "Back" : "Close"
            var actionButtons: [UIBarButtonItem] = []
            if activeActions.contains("search") {
                actionButtons.append(searchButton!)
            }
            if activeActions.contains("info") {
                actionButtons.append(infoButton!)
            }
            navigationItem.rightBarButtonItems = actionButtons
        case "openUrl":
            guard let target = commandData as? String else {
                print("Error: Bad podNav openUrl command data: \(String(describing: commandData))")
                break
            }
            openUrl(target)
        default:
            print("Error: Bad podNav command message - unknown command '\(commandName)'")
        }
    }
}

